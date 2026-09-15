import { requireText, requireDate, optionalDate, checkboxOn, validateFile } from "@/lib/validation/cms";
import { Constants } from "@/lib/supabase/database.types";

const MAX_TITLE = 180;
const MAX_DESCRIPTION = 2000;
const MAX_SLUG = 140;

export const ALLOWED_ATTACHMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"] as const;
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const NOTICE_CATEGORY_VALUES = Constants.public.Enums.notice_category;
export type NoticeCategoryValue = (typeof NOTICE_CATEGORY_VALUES)[number];

export interface NoticeFieldValues {
  title: string;
  category: NoticeCategoryValue;
  noticeDate: string;
  description: string;
  expiryDate: string | null;
  important: boolean;
}

export type NoticeValidationResult = { values: NoticeFieldValues } | { error: string };

export function validateNoticeFields(formData: FormData): NoticeValidationResult {
  const title = requireText(formData, "title", "Title", MAX_TITLE);
  if ("error" in title) return title;

  const categoryRaw = String(formData.get("category") ?? "");
  if (!NOTICE_CATEGORY_VALUES.includes(categoryRaw as NoticeCategoryValue)) {
    return { error: "Please choose a valid category." };
  }

  const noticeDate = requireDate(formData, "notice_date", "Notice date");
  if ("error" in noticeDate) return noticeDate;

  const description = requireText(formData, "description", "Description", MAX_DESCRIPTION);
  if ("error" in description) return description;

  const expiryDate = optionalDate(formData, "expiry_date", "Expiry date");
  if ("error" in expiryDate) return expiryDate;

  return {
    values: {
      title: title.value,
      category: categoryRaw as NoticeCategoryValue,
      noticeDate: noticeDate.value,
      description: description.value,
      expiryDate: expiryDate.value,
      important: checkboxOn(formData, "important"),
    },
  };
}

export function validateNoticeSlugOverride(formData: FormData): { value: string } | { error: string } {
  const raw = String(formData.get("slug") ?? "").trim();
  if (!raw) return { error: "Slug is required." };
  if (raw.length > MAX_SLUG) return { error: `Slug must be ${MAX_SLUG} characters or fewer.` };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw)) {
    return { error: "Slug may only contain lowercase letters, numbers, and hyphens." };
  }
  return { value: raw };
}

export function validateNoticeAttachment(file: File | null) {
  return validateFile(file, ALLOWED_ATTACHMENT_TYPES, MAX_ATTACHMENT_BYTES, "Attachment");
}
