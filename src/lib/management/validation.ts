const MAX_NAME_LENGTH = 120;
const MAX_DESIGNATION_LENGTH = 120;
const MAX_BIO_LENGTH = 600;

export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export interface ManagementFieldValues {
  fullName: string;
  designation: string;
  shortBio: string;
  displayOrder: number;
  isFeatured: boolean;
}

export type ValidationResult<T> = { values: T } | { error: string };

/**
 * Server-side validation for the Management & Leadership form fields.
 * Client-side `required`/`maxLength` attributes are a UX nicety only —
 * this is the real boundary, since a Server Action is a public POST
 * endpoint regardless of what rendered the form that called it.
 */
export function validateManagementFields(formData: FormData): ValidationResult<ManagementFieldValues> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const shortBio = String(formData.get("short_bio") ?? "").trim();
  const displayOrderRaw = String(formData.get("display_order") ?? "0").trim();
  const isFeatured = formData.get("is_featured") === "on";

  if (!fullName) {
    return { error: "Full name is required." };
  }
  if (fullName.length > MAX_NAME_LENGTH) {
    return { error: `Full name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }
  if (!designation) {
    return { error: "Designation is required." };
  }
  if (designation.length > MAX_DESIGNATION_LENGTH) {
    return { error: `Designation must be ${MAX_DESIGNATION_LENGTH} characters or fewer.` };
  }
  if (shortBio.length > MAX_BIO_LENGTH) {
    return { error: `Short bio must be ${MAX_BIO_LENGTH} characters or fewer.` };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);
  if (!Number.isInteger(displayOrder) || String(displayOrder) !== displayOrderRaw.replace(/^\+/, "")) {
    return { error: "Display order must be a whole number." };
  }

  return { values: { fullName, designation, shortBio, displayOrder, isFeatured } };
}

export function validatePhotoFile(file: File | null): { error: string } | { ok: true } {
  if (!file || file.size === 0) {
    return { ok: true };
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.type as (typeof ALLOWED_PHOTO_TYPES)[number])) {
    return { error: "Photo must be a JPEG, PNG, or WEBP image." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { error: "Photo must be smaller than 5MB." };
  }
  return { ok: true };
}
