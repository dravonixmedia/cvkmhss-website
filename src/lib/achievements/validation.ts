import { requireText, requireDate, validateFile } from "@/lib/validation/cms";
import { Constants } from "@/lib/supabase/database.types";

const MAX_TITLE = 180;
const MAX_DESCRIPTION = 2000;
const MAX_SLUG = 140;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ACHIEVEMENT_CATEGORY_VALUES = Constants.public.Enums.achievement_category;
export type AchievementCategoryValue = (typeof ACHIEVEMENT_CATEGORY_VALUES)[number];

export interface AchievementFieldValues {
  title: string;
  category: AchievementCategoryValue;
  achievementDate: string;
  description: string;
}

export type AchievementValidationResult = { values: AchievementFieldValues } | { error: string };

export function validateAchievementFields(formData: FormData): AchievementValidationResult {
  const title = requireText(formData, "title", "Title", MAX_TITLE);
  if ("error" in title) return title;

  const categoryRaw = String(formData.get("category") ?? "");
  if (!ACHIEVEMENT_CATEGORY_VALUES.includes(categoryRaw as AchievementCategoryValue)) {
    return { error: "Please choose a valid category." };
  }

  const achievementDate = requireDate(formData, "achievement_date", "Achievement date");
  if ("error" in achievementDate) return achievementDate;

  const description = requireText(formData, "description", "Description", MAX_DESCRIPTION);
  if ("error" in description) return description;

  return {
    values: {
      title: title.value,
      category: categoryRaw as AchievementCategoryValue,
      achievementDate: achievementDate.value,
      description: description.value,
    },
  };
}

export function validateAchievementSlugOverride(
  formData: FormData
): { value: string } | { error: string } {
  const raw = String(formData.get("slug") ?? "").trim();
  if (!raw) return { error: "Slug is required." };
  if (raw.length > MAX_SLUG) return { error: `Slug must be ${MAX_SLUG} characters or fewer.` };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw)) {
    return { error: "Slug may only contain lowercase letters, numbers, and hyphens." };
  }
  return { value: raw };
}

export function validateAchievementImage(file: File | null) {
  return validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, "Image");
}
