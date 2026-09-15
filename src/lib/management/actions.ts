"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { validateManagementFields, validatePhotoFile } from "@/lib/management/validation";
import { uploadManagementPhoto, deleteManagementPhoto } from "@/lib/management/storage";

export interface ManagementFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this member. Please check the details and try again.";

function resolveStatusFromIntent(formData: FormData): "draft" | "published" {
  return formData.get("intent") === "publish" ? "published" : "draft";
}

async function resolvePhoto(
  formData: FormData,
  existingPath: string | null
): Promise<{ path: string | null } | { error: string }> {
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { path: existingPath };
  }

  const validation = validatePhotoFile(file);
  if ("error" in validation) return validation;

  return uploadManagementPhoto(file);
}

/**
 * Single create action for both "Save as Draft" and "Publish", chosen by
 * which named submit button the admin clicked (`intent=draft|publish`,
 * read from the submitted FormData) — avoids needing two separate
 * useActionState-bound actions for one form.
 */
export async function createManagementMember(
  _prevState: ManagementFormState,
  formData: FormData
): Promise<ManagementFormState> {
  const admin = await requireAdmin();

  const parsed = validateManagementFields(formData);
  if ("error" in parsed) return parsed;

  const photo = await resolvePhoto(formData, null);
  if ("error" in photo) return photo;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("management_members").insert({
    full_name: parsed.values.fullName,
    designation: parsed.values.designation,
    short_bio: parsed.values.shortBio || null,
    display_order: parsed.values.displayOrder,
    is_featured: parsed.values.isFeatured,
    photo_path: photo.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) {
    return { error: GENERIC_SAVE_ERROR };
  }

  revalidatePath("/admin/management");
  revalidatePath("/about");
  redirect("/admin/management");
}

/** Edits fields only — publish state is changed separately via setManagementMemberStatus. */
export async function updateManagementMember(
  id: string,
  _prevState: ManagementFormState,
  formData: FormData
): Promise<ManagementFormState> {
  const admin = await requireAdmin();

  const parsed = validateManagementFields(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("management_members")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  const photo = await resolvePhoto(formData, existing?.photo_path ?? null);
  if ("error" in photo) return photo;

  const { error } = await supabase
    .from("management_members")
    .update({
      full_name: parsed.values.fullName,
      designation: parsed.values.designation,
      short_bio: parsed.values.shortBio || null,
      display_order: parsed.values.displayOrder,
      is_featured: parsed.values.isFeatured,
      photo_path: photo.path,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) {
    return { error: GENERIC_SAVE_ERROR };
  }

  // Clean up the replaced photo only after the row update has succeeded.
  if (existing?.photo_path && photo.path !== existing.photo_path) {
    await deleteManagementPhoto(existing.photo_path);
  }

  revalidatePath("/admin/management");
  revalidatePath("/about");
  redirect("/admin/management");
}

export async function setManagementMemberStatus(
  id: string,
  status: "draft" | "published"
): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") {
    updates.published_at = new Date().toISOString();
  }

  await supabase.from("management_members").update(updates).eq("id", id);

  revalidatePath("/admin/management");
  revalidatePath("/about");
}

export async function deleteManagementMember(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("management_members")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("management_members").delete().eq("id", id);

  if (!error && existing?.photo_path) {
    await deleteManagementPhoto(existing.photo_path);
  }

  revalidatePath("/admin/management");
  revalidatePath("/about");
}

/**
 * Swaps display_order with the adjacent member in the currently sorted
 * list. Simple and robust rather than a drag-and-drop reordering UI, per
 * the brief — a numeric field plus these two directional actions cover
 * the school's actual need.
 */
export async function moveManagementMember(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("management_members")
    .select("id, display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!members) return;

  const index = members.findIndex((member) => member.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= members.length) return;

  const current = members[index];
  const swap = members[swapIndex];

  await supabase
    .from("management_members")
    .update({ display_order: swap.display_order })
    .eq("id", current.id);
  await supabase
    .from("management_members")
    .update({ display_order: current.display_order })
    .eq("id", swap.id);

  revalidatePath("/admin/management");
  revalidatePath("/about");
}
