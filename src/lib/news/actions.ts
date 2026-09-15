"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateUniqueSlug } from "@/lib/supabase/slug";
import {
  validateNewsFields,
  validateNewsSlugOverride,
  validateNewsImage,
} from "@/lib/news/validation";
import { uploadNewsImage, deleteNewsImage } from "@/lib/news/storage";

export interface NewsFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this article. Please check the details and try again.";

function resolveStatusFromIntent(formData: FormData): "draft" | "published" {
  return formData.get("intent") === "publish" ? "published" : "draft";
}

async function resolveImage(
  formData: FormData,
  existingPath: string | null
): Promise<{ path: string | null } | { error: string }> {
  const file = formData.get("featured_image");
  if (!(file instanceof File) || file.size === 0) {
    return { path: existingPath };
  }
  const validation = validateNewsImage(file);
  if ("error" in validation) return validation;
  return uploadNewsImage(file);
}

export async function createNews(
  _prevState: NewsFormState,
  formData: FormData
): Promise<NewsFormState> {
  const admin = await requireAdmin();

  const parsed = validateNewsFields(formData);
  if ("error" in parsed) return parsed;

  const image = await resolveImage(formData, null);
  if ("error" in image) return image;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "news", parsed.values.title);

  const { error } = await supabase.from("news").insert({
    slug,
    title: parsed.values.title,
    category: parsed.values.category,
    summary: parsed.values.summary,
    body: parsed.values.body,
    author: parsed.values.author,
    featured_image: image.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) return { error: GENERIC_SAVE_ERROR };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateNews(
  id: string,
  _prevState: NewsFormState,
  formData: FormData
): Promise<NewsFormState> {
  const admin = await requireAdmin();

  const parsed = validateNewsFields(formData);
  if ("error" in parsed) return parsed;

  const slugResult = validateNewsSlugOverride(formData);
  if ("error" in slugResult) return slugResult;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("news")
    .select("featured_image, slug")
    .eq("id", id)
    .maybeSingle();

  const image = await resolveImage(formData, existing?.featured_image ?? null);
  if ("error" in image) return image;

  let slug = slugResult.value;
  if (slug !== existing?.slug) {
    slug = await generateUniqueSlug(supabase, "news", slug, id);
  }

  const { error } = await supabase
    .from("news")
    .update({
      slug,
      title: parsed.values.title,
      category: parsed.values.category,
      summary: parsed.values.summary,
      body: parsed.values.body,
      author: parsed.values.author,
      featured_image: image.path,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.featured_image && image.path !== existing.featured_image) {
    await deleteNewsImage(existing.featured_image);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function setNewsStatus(id: string, status: "draft" | "published"): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") updates.published_at = new Date().toISOString();

  await supabase.from("news").update(updates).eq("id", id);

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function deleteNews(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("news")
    .select("featured_image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("news").delete().eq("id", id);

  if (!error && existing?.featured_image) {
    await deleteNewsImage(existing.featured_image);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
}
