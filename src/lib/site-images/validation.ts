import { optionalText, validateFile } from "@/lib/validation/cms";

export const SITE_IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const SITE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const MAX_ALT_TEXT = 200;

export function validateSiteImageFile(file: File | null) {
  return validateFile(file, SITE_IMAGE_ALLOWED_TYPES, SITE_IMAGE_MAX_BYTES, "Image");
}

export function validateSiteImageAltText(formData: FormData) {
  return optionalText(formData, "alt_text", MAX_ALT_TEXT);
}
