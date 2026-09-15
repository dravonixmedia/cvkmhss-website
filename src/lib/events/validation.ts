import { requireText, requireDate, optionalTime, validateFile } from "@/lib/validation/cms";

const MAX_TITLE = 180;
const MAX_LOCATION = 200;
const MAX_DESCRIPTION = 4000;
const MAX_SLUG = 140;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export interface EventFieldValues {
  title: string;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  location: string;
  description: string;
}

export type EventValidationResult = { values: EventFieldValues } | { error: string };

export function validateEventFields(formData: FormData): EventValidationResult {
  const title = requireText(formData, "title", "Title", MAX_TITLE);
  if ("error" in title) return title;

  const eventDate = requireDate(formData, "event_date", "Event date");
  if ("error" in eventDate) return eventDate;

  const startTime = optionalTime(formData, "start_time", "Start time");
  if ("error" in startTime) return startTime;

  const endTime = optionalTime(formData, "end_time", "End time");
  if ("error" in endTime) return endTime;

  const location = requireText(formData, "location", "Location", MAX_LOCATION);
  if ("error" in location) return location;

  const description = requireText(formData, "description", "Description", MAX_DESCRIPTION);
  if ("error" in description) return description;

  return {
    values: {
      title: title.value,
      eventDate: eventDate.value,
      startTime: startTime.value,
      endTime: endTime.value,
      location: location.value,
      description: description.value,
    },
  };
}

export function validateEventSlugOverride(formData: FormData): { value: string } | { error: string } {
  const raw = String(formData.get("slug") ?? "").trim();
  if (!raw) return { error: "Slug is required." };
  if (raw.length > MAX_SLUG) return { error: `Slug must be ${MAX_SLUG} characters or fewer.` };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw)) {
    return { error: "Slug may only contain lowercase letters, numbers, and hyphens." };
  }
  return { value: raw };
}

export function validateEventImage(file: File | null) {
  return validateFile(file, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, "Event image");
}
