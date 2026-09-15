"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateUniqueSlug } from "@/lib/supabase/slug";
import {
  validateEventFields,
  validateEventSlugOverride,
  validateEventImage,
} from "@/lib/events/validation";
import { uploadEventImage, deleteEventImage } from "@/lib/events/storage";

export interface EventFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this event. Please check the details and try again.";

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
  const validation = validateEventImage(file);
  if ("error" in validation) return validation;
  return uploadEventImage(file);
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const admin = await requireAdmin();

  const parsed = validateEventFields(formData);
  if ("error" in parsed) return parsed;

  const image = await resolveImage(formData, null);
  if ("error" in image) return image;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "events", parsed.values.title);

  const { error } = await supabase.from("events").insert({
    slug,
    title: parsed.values.title,
    event_date: parsed.values.eventDate,
    start_time: parsed.values.startTime,
    end_time: parsed.values.endTime,
    location: parsed.values.location,
    description: parsed.values.description,
    image: image.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) return { error: GENERIC_SAVE_ERROR };

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const admin = await requireAdmin();

  const parsed = validateEventFields(formData);
  if ("error" in parsed) return parsed;

  const slugResult = validateEventSlugOverride(formData);
  if ("error" in slugResult) return slugResult;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("events")
    .select("image, slug")
    .eq("id", id)
    .maybeSingle();

  const image = await resolveImage(formData, existing?.image ?? null);
  if ("error" in image) return image;

  let slug = slugResult.value;
  if (slug !== existing?.slug) {
    slug = await generateUniqueSlug(supabase, "events", slug, id);
  }

  const { error } = await supabase
    .from("events")
    .update({
      slug,
      title: parsed.values.title,
      event_date: parsed.values.eventDate,
      start_time: parsed.values.startTime,
      end_time: parsed.values.endTime,
      location: parsed.values.location,
      description: parsed.values.description,
      image: image.path,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.image && image.path !== existing.image) {
    await deleteEventImage(existing.image);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function setEventStatus(id: string, status: "draft" | "published"): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") updates.published_at = new Date().toISOString();

  await supabase.from("events").update(updates).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase.from("events").select("image").eq("id", id).maybeSingle();

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (!error && existing?.image) {
    await deleteEventImage(existing.image);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
}
