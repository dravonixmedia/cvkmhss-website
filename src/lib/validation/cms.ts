/**
 * Small, shared server-side validation primitives reused by every CMS
 * domain's validation.ts. Client-side `required`/`maxLength` attributes
 * are a UX nicety only — these are the real boundary, since a Server
 * Action is a public POST endpoint regardless of what rendered the form
 * that called it.
 */

export type FieldResult<T> = { value: T } | { error: string };

export function requireText(
  formData: FormData,
  field: string,
  label: string,
  maxLength: number
): FieldResult<string> {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return { error: `${label} is required.` };
  if (value.length > maxLength) {
    return { error: `${label} must be ${maxLength} characters or fewer.` };
  }
  return { value };
}

export function optionalText(formData: FormData, field: string, maxLength: number): FieldResult<string> {
  const value = String(formData.get(field) ?? "").trim();
  if (value.length > maxLength) {
    return { error: `This field must be ${maxLength} characters or fewer.` };
  }
  return { value };
}

export function requireDate(formData: FormData, field: string, label: string): FieldResult<string> {
  const value = String(formData.get(field) ?? "").trim();
  if (!value || Number.isNaN(Date.parse(value))) {
    return { error: `${label} must be a valid date.` };
  }
  return { value };
}

export function optionalDate(formData: FormData, field: string, label: string): FieldResult<string | null> {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return { value: null };
  if (Number.isNaN(Date.parse(value))) {
    return { error: `${label} must be a valid date.` };
  }
  return { value };
}

export function optionalTime(formData: FormData, field: string, label: string): FieldResult<string | null> {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return { value: null };
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return { error: `${label} must be a valid time.` };
  }
  return { value };
}

export function requireInteger(formData: FormData, field: string, label: string): FieldResult<number> {
  const raw = String(formData.get(field) ?? "0").trim();
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || String(parsed) !== raw.replace(/^\+/, "")) {
    return { error: `${label} must be a whole number.` };
  }
  return { value: parsed };
}

export function checkboxOn(formData: FormData, field: string): boolean {
  return formData.get(field) === "on";
}

export function validateFile(
  file: File | null,
  allowedTypes: readonly string[],
  maxBytes: number,
  kindLabel: string
): { error: string } | { ok: true } {
  if (!file || file.size === 0) return { ok: true };
  if (!allowedTypes.includes(file.type)) {
    return { error: `${kindLabel} must be one of: ${allowedTypes.join(", ")}.` };
  }
  if (file.size > maxBytes) {
    return { error: `${kindLabel} must be smaller than ${Math.round(maxBytes / (1024 * 1024))}MB.` };
  }
  return { ok: true };
}
