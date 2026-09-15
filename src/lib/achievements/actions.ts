"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateUniqueSlug } from "@/lib/supabase/slug";
import {
  validateAchievementFields,
  validateAchievementSlugOverride,
  validateAchievementImage,
} from "@/lib/achievements/validation";
import { uploadAchievementImage, deleteAchievementImage } from "@/lib/achievements/storage";

export interface AchievementFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this achievement. Please check the details and try again.";

function resolveStatusFromIntent(formData: FormData): "draft" | "published" {
  return formData.get("intent") === "publish" ? "published" : "draft";
}

async function resolveImage(
  formData: FormData,
  existingPath: string | null
): Promise<{ path: string | null } | { error: string }> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { path: existingPath };
  }
  const validation = validateAchievementImage(file);
  if ("error" in validation) return validation;
  return uploadAchievementImage(file);
}

export async function createAchievement(
  _prevState: AchievementFormState,
  formData: FormData
): Promise<AchievementFormState> {
  const admin = await requireAdmin();

  const parsed = validateAchievementFields(formData);
  if ("error" in parsed) return parsed;

  const image = await resolveImage(formData, null);
  if ("error" in image) return image;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "achievements", parsed.values.title);

  const { error } = await supabase.from("achievements").insert({
    slug,
    title: parsed.values.title,
    category: parsed.values.category,
    achievement_date: parsed.values.achievementDate,
    description: parsed.values.description,
    image: image.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) return { error: GENERIC_SAVE_ERROR };

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  redirect("/admin/achievements");
}

export async function updateAchievement(
  id: string,
  _prevState: AchievementFormState,
  formData: FormData
): Promise<AchievementFormState> {
  const admin = await requireAdmin();

  const parsed = validateAchievementFields(formData);
  if ("error" in parsed) return parsed;

  const slugResult = validateAchievementSlugOverride(formData);
  if ("error" in slugResult) return slugResult;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("achievements")
    .select("image, slug")
    .eq("id", id)
    .maybeSingle();

  const image = await resolveImage(formData, existing?.image ?? null);
  if ("error" in image) return image;

  let slug = slugResult.value;
  if (slug !== existing?.slug) {
    slug = await generateUniqueSlug(supabase, "achievements", slug, id);
  }

  const { error } = await supabase
    .from("achievements")
    .update({
      slug,
      title: parsed.values.title,
      category: parsed.values.category,
      achievement_date: parsed.values.achievementDate,
      description: parsed.values.description,
      image: image.path,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.image && image.path !== existing.image) {
    await deleteAchievementImage(existing.image);
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  redirect("/admin/achievements");
}

export async function setAchievementStatus(id: string, status: "draft" | "published"): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") updates.published_at = new Date().toISOString();

  await supabase.from("achievements").update(updates).eq("id", id);

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
}

export async function deleteAchievement(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("achievements")
    .select("image")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("achievements").delete().eq("id", id);

  if (!error && existing?.image) {
    await deleteAchievementImage(existing.image);
  }

  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
}
