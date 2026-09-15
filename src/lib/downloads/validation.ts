import { requireText, optionalText, validateFile } from "@/lib/validation/cms";
import { Constants } from "@/lib/supabase/database.types";

const MAX_TITLE = 180;
const MAX_DESCRIPTION = 600;

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
] as const;
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export const DOWNLOAD_CATEGORY_VALUES = Constants.public.Enums.download_category;
export type DownloadCategoryValue = (typeof DOWNLOAD_CATEGORY_VALUES)[number];

export interface DownloadFieldValues {
  title: string;
  category: DownloadCategoryValue;
  description: string | null;
}

export type DownloadValidationResult = { values: DownloadFieldValues } | { error: string };

export function validateDownloadFields(formData: FormData): DownloadValidationResult {
  const title = requireText(formData, "title", "Title", MAX_TITLE);
  if ("error" in title) return title;

  const categoryRaw = String(formData.get("category") ?? "");
  if (!DOWNLOAD_CATEGORY_VALUES.includes(categoryRaw as DownloadCategoryValue)) {
    return { error: "Please choose a valid category." };
  }

  const description = optionalText(formData, "description", MAX_DESCRIPTION);
  if ("error" in description) return description;

  return {
    values: {
      title: title.value,
      category: categoryRaw as DownloadCategoryValue,
      description: description.value || null,
    },
  };
}

export function validateDownloadDocument(file: File | null) {
  return validateFile(file, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_BYTES, "Document");
}
