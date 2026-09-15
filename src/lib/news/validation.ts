import { requireText, optionalText, validateFile } from "@/lib/validation/cms";

const MAX_TITLE = 180;
const MAX_CATEGORY = 60;
const MAX_SUMMARY = 400;
const MAX_AUTHOR = 120;
const MAX_SLUG = 140;
const MAX_BODY = 20000;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export interface NewsFieldValues {
  title: string;
  category: string;
  summary: string;
  body: string[];
  author: string | null;
}

export type NewsValidationResult = { values: NewsFieldValues } | { error: string };

export function validateNewsFields(formData: FormData): NewsValidationResult {
  const title = requireText(formData, "title", "Title", MAX_TITLE);
  if ("error" in title) return title;

  const category = requireText(formData, "category", "Category", MAX_CATEGORY);
  if ("error" in category) return category;

  const summary = requireText(formData, "summary", "Summary", MAX_SUMMARY);
  if ("error" in summary) return summary;

  const bodyRaw = String(formData.get("body") ?? "").trim();
  if (!bodyRaw) return { error: "Body content is required." };
  if (bodyRaw.length > MAX_BODY) return { error: `Body content must be ${MAX_BODY} characters or fewer.` };
  const body = bodyRaw
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (body.length === 0) return { error: "Body content is required." };

  const author = optionalText(formData, "author", MAX_AUTHOR);
  if ("error" in author) return author;

  return {
    values: {
      title: title.value,
      category: category.value,
      summary: summary.value,
      body,
      author: author.value || null,
    },
  };
}

/** Only used on edit, where the admin may correct the auto-generated slug. */
export function validateNewsSlugOverride(formData: FormData): { value: string } | { error: string } {
  const raw = String(formData.get("slug") ?? "").trim();
  if (!raw) return { error: "Slug is required." };
  if (raw.length > MAX_SLUG) return { error: `Slug must be ${MAX_SLUG} characters or fewer.` };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw)) {
    return { error: "Slug may only contain lowercase letters, numbers, and hyphens." };
  }
  return { value: raw };
}

export function validateNewsImage(file: File | null) {
  return validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, "Featured image");
}
