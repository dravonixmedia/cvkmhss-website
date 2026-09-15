"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateUniqueSlug } from "@/lib/supabase/slug";
import {
  validateGalleryAlbumFields,
  validateGalleryAlbumSlugOverride,
  validateGalleryImage,
} from "@/lib/gallery/validation";
import { uploadGalleryCoverImage, deleteGalleryFile, deleteGalleryFiles } from "@/lib/gallery/storage";

export interface GalleryAlbumFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this album. Please check the details and try again.";

function resolveStatusFromIntent(formData: FormData): "draft" | "published" {
  return formData.get("intent") === "publish" ? "published" : "draft";
}

async function resolveCoverImage(
  albumId: string,
  formData: FormData,
  existingPath: string | null
): Promise<{ path: string | null } | { error: string }> {
  const file = formData.get("cover_image");
  if (!(file instanceof File) || file.size === 0) {
    return { path: existingPath };
  }
  const validation = validateGalleryImage(file);
  if ("error" in validation) return validation;
  return uploadGalleryCoverImage(albumId, file);
}

/**
 * The album id is generated up front (rather than left to the database
 * default) so the cover image can be uploaded under gallery/{albumId}/
 * before the album row exists — Storage has no foreign key to the row.
 */
export async function createGalleryAlbum(
  _prevState: GalleryAlbumFormState,
  formData: FormData
): Promise<GalleryAlbumFormState> {
  const admin = await requireAdmin();

  const parsed = validateGalleryAlbumFields(formData);
  if ("error" in parsed) return parsed;

  const albumId = crypto.randomUUID();
  const cover = await resolveCoverImage(albumId, formData, null);
  if ("error" in cover) return cover;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "gallery_albums", parsed.values.title);

  const { error } = await supabase.from("gallery_albums").insert({
    id: albumId,
    slug,
    title: parsed.values.title,
    category: parsed.values.category,
    description: parsed.values.description,
    album_date: parsed.values.albumDate,
    cover_image_path: cover.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) {
    if (cover.path) await deleteGalleryFile(cover.path);
    return { error: GENERIC_SAVE_ERROR };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect(`/admin/gallery/${albumId}/images`);
}

export async function updateGalleryAlbum(
  id: string,
  _prevState: GalleryAlbumFormState,
  formData: FormData
): Promise<GalleryAlbumFormState> {
  const admin = await requireAdmin();

  const parsed = validateGalleryAlbumFields(formData);
  if ("error" in parsed) return parsed;

  const slugResult = validateGalleryAlbumSlugOverride(formData);
  if ("error" in slugResult) return slugResult;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("gallery_albums")
    .select("cover_image_path, slug")
    .eq("id", id)
    .maybeSingle();

  const cover = await resolveCoverImage(id, formData, existing?.cover_image_path ?? null);
  if ("error" in cover) return cover;

  let slug = slugResult.value;
  if (slug !== existing?.slug) {
    slug = await generateUniqueSlug(supabase, "gallery_albums", slug, id);
  }

  const { error } = await supabase
    .from("gallery_albums")
    .update({
      slug,
      title: parsed.values.title,
      category: parsed.values.category,
      description: parsed.values.description,
      album_date: parsed.values.albumDate,
      cover_image_path: cover.path,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.cover_image_path && cover.path !== existing.cover_image_path) {
    await deleteGalleryFile(existing.cover_image_path);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  redirect("/admin/gallery");
}

export async function setGalleryAlbumStatus(id: string, status: "draft" | "published"): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") updates.published_at = new Date().toISOString();

  await supabase.from("gallery_albums").update(updates).eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

/**
 * gallery_images rows cascade-delete with the album automatically, but
 * the underlying Storage objects (cover + every image) do not — those
 * are collected before the row delete and removed afterward.
 */
export async function deleteGalleryAlbum(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: images } = await supabase.from("gallery_images").select("image_path").eq("album_id", id);
  const { data: existing } = await supabase
    .from("gallery_albums")
    .select("cover_image_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("gallery_albums").delete().eq("id", id);

  if (!error) {
    const paths = Array.from(
      new Set([existing?.cover_image_path ?? null, ...(images ?? []).map((img) => img.image_path)])
    );
    await deleteGalleryFiles(paths);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
