import { requireText, optionalText, requireDate, validateFile } from "@/lib/validation/cms";
import { Constants } from "@/lib/supabase/database.types";

const MAX_TITLE = 180;
const MAX_DESCRIPTION = 2000;
const MAX_SLUG = 140;
const MAX_CAPTION = 300;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const GALLERY_CATEGORY_VALUES = Constants.public.Enums.gallery_category;
export type GalleryCategoryValue = (typeof GALLERY_CATEGORY_VALUES)[number];

export interface GalleryAlbumFieldValues {
  title: string;
  category: GalleryCategoryValue;
  description: string;
  albumDate: string;
}

export type GalleryAlbumValidationResult = { values: GalleryAlbumFieldValues } | { error: string };

export function validateGalleryAlbumFields(formData: FormData): GalleryAlbumValidationResult {
  const title = requireText(formData, "title", "Title", MAX_TITLE);
  if ("error" in title) return title;

  const categoryRaw = String(formData.get("category") ?? "");
  if (!GALLERY_CATEGORY_VALUES.includes(categoryRaw as GalleryCategoryValue)) {
    return { error: "Please choose a valid category." };
  }

  const description = requireText(formData, "description", "Description", MAX_DESCRIPTION);
  if ("error" in description) return description;

  const albumDate = requireDate(formData, "album_date", "Album date");
  if ("error" in albumDate) return albumDate;

  return {
    values: {
      title: title.value,
      category: categoryRaw as GalleryCategoryValue,
      description: description.value,
      albumDate: albumDate.value,
    },
  };
}

export function validateGalleryAlbumSlugOverride(
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

export function validateGalleryImage(file: File | null) {
  return validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, "Image");
}

export function validateGalleryCaption(formData: FormData): { value: string } | { error: string } {
  return optionalText(formData, "caption", MAX_CAPTION);
}
