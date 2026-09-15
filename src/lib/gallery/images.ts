"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { validateGalleryImage } from "@/lib/gallery/validation";
import { uploadGalleryImage, deleteGalleryFile, deleteGalleryFiles } from "@/lib/gallery/storage";

export interface GalleryImagesFormState {
  error?: string;
}

const MAX_IMAGES_PER_UPLOAD = 20;
const MAX_CAPTION = 300;

function imagesPath(albumId: string): string {
  return `/admin/gallery/${albumId}/images`;
}

export async function addGalleryImages(
  albumId: string,
  _prevState: GalleryImagesFormState,
  formData: FormData
): Promise<GalleryImagesFormState> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const { data: album } = await supabase
    .from("gallery_albums")
    .select("id, title")
    .eq("id", albumId)
    .maybeSingle();
  if (!album) return { error: "Album not found." };

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: "Choose at least one image to upload." };
  if (files.length > MAX_IMAGES_PER_UPLOAD) {
    return { error: `Upload at most ${MAX_IMAGES_PER_UPLOAD} images at a time.` };
  }
  for (const file of files) {
    const validation = validateGalleryImage(file);
    if ("error" in validation) return validation;
  }

  const { data: lastImage } = await supabase
    .from("gallery_images")
    .select("sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const startOrder = (lastImage?.sort_order ?? -1) + 1;

  const uploadedPaths: string[] = [];
  for (const file of files) {
    const result = await uploadGalleryImage(albumId, file);
    if ("error" in result) {
      await deleteGalleryFiles(uploadedPaths);
      return { error: result.error };
    }
    uploadedPaths.push(result.path);
  }

  const rows = uploadedPaths.map((path, index) => ({
    album_id: albumId,
    image_path: path,
    alt_text: `${album.title} — photo ${startOrder + index + 1}`,
    sort_order: startOrder + index,
    created_by: admin.profile.id,
  }));

  const { error } = await supabase.from("gallery_images").insert(rows);
  if (error) {
    await deleteGalleryFiles(uploadedPaths);
    return { error: "Could not save the uploaded images. Please try again." };
  }

  revalidatePath(imagesPath(albumId));
  revalidatePath("/gallery");
  return {};
}

export async function deleteGalleryImage(albumId: string, imageId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: image } = await supabase
    .from("gallery_images")
    .select("image_path")
    .eq("id", imageId)
    .maybeSingle();
  const { data: album } = await supabase
    .from("gallery_albums")
    .select("cover_image_path")
    .eq("id", albumId)
    .maybeSingle();

  const { error } = await supabase.from("gallery_images").delete().eq("id", imageId);

  if (!error && image?.image_path) {
    await deleteGalleryFile(image.image_path);
    if (album?.cover_image_path === image.image_path) {
      await supabase.from("gallery_albums").update({ cover_image_path: null }).eq("id", albumId);
    }
  }

  revalidatePath(imagesPath(albumId));
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function updateGalleryImageCaption(
  albumId: string,
  imageId: string,
  formData: FormData
): Promise<void> {
  await requireAdmin();
  const caption = String(formData.get("caption") ?? "")
    .trim()
    .slice(0, MAX_CAPTION);

  const supabase = await createClient();
  await supabase
    .from("gallery_images")
    .update({ caption: caption || null })
    .eq("id", imageId)
    .eq("album_id", albumId);

  revalidatePath(imagesPath(albumId));
}

/** Swaps sort_order with the adjacent image in the album, mirroring moveManagementMember. */
export async function moveGalleryImage(
  albumId: string,
  imageId: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, sort_order")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });

  if (!images) return;

  const index = images.findIndex((img) => img.id === imageId);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= images.length) return;

  const current = images[index];
  const swap = images[swapIndex];

  await supabase.from("gallery_images").update({ sort_order: swap.sort_order }).eq("id", current.id);
  await supabase.from("gallery_images").update({ sort_order: current.sort_order }).eq("id", swap.id);

  revalidatePath(imagesPath(albumId));
}

export async function setAlbumCoverImage(albumId: string, imagePath: string): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  await supabase
    .from("gallery_albums")
    .update({ cover_image_path: imagePath, updated_by: admin.profile.id })
    .eq("id", albumId);

  revalidatePath(imagesPath(albumId));
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
