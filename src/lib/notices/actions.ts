"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { generateUniqueSlug } from "@/lib/supabase/slug";
import {
  validateNoticeFields,
  validateNoticeSlugOverride,
  validateNoticeAttachment,
} from "@/lib/notices/validation";
import { uploadNoticeAttachment, deleteNoticeAttachment } from "@/lib/notices/storage";

export interface NoticeFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this notice. Please check the details and try again.";

function resolveStatusFromIntent(formData: FormData): "draft" | "published" {
  return formData.get("intent") === "publish" ? "published" : "draft";
}

async function resolveAttachment(
  formData: FormData,
  existingPath: string | null
): Promise<{ path: string | null } | { error: string }> {
  const file = formData.get("attachment");
  if (!(file instanceof File) || file.size === 0) {
    return { path: existingPath };
  }
  const validation = validateNoticeAttachment(file);
  if ("error" in validation) return validation;
  return uploadNoticeAttachment(file);
}

export async function createNotice(
  _prevState: NoticeFormState,
  formData: FormData
): Promise<NoticeFormState> {
  const admin = await requireAdmin();

  const parsed = validateNoticeFields(formData);
  if ("error" in parsed) return parsed;

  const attachment = await resolveAttachment(formData, null);
  if ("error" in attachment) return attachment;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();
  const slug = await generateUniqueSlug(supabase, "notices", parsed.values.title);

  const { error } = await supabase.from("notices").insert({
    slug,
    title: parsed.values.title,
    category: parsed.values.category,
    notice_date: parsed.values.noticeDate,
    description: parsed.values.description,
    expiry_date: parsed.values.expiryDate,
    important: parsed.values.important,
    attachment_path: attachment.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) return { error: GENERIC_SAVE_ERROR };

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  redirect("/admin/notices");
}

export async function updateNotice(
  id: string,
  _prevState: NoticeFormState,
  formData: FormData
): Promise<NoticeFormState> {
  const admin = await requireAdmin();

  const parsed = validateNoticeFields(formData);
  if ("error" in parsed) return parsed;

  const slugResult = validateNoticeSlugOverride(formData);
  if ("error" in slugResult) return slugResult;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("notices")
    .select("attachment_path, slug")
    .eq("id", id)
    .maybeSingle();

  const attachment = await resolveAttachment(formData, existing?.attachment_path ?? null);
  if ("error" in attachment) return attachment;

  let slug = slugResult.value;
  if (slug !== existing?.slug) {
    slug = await generateUniqueSlug(supabase, "notices", slug, id);
  }

  const { error } = await supabase
    .from("notices")
    .update({
      slug,
      title: parsed.values.title,
      category: parsed.values.category,
      notice_date: parsed.values.noticeDate,
      description: parsed.values.description,
      expiry_date: parsed.values.expiryDate,
      important: parsed.values.important,
      attachment_path: attachment.path,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.attachment_path && attachment.path !== existing.attachment_path) {
    await deleteNoticeAttachment(existing.attachment_path);
  }

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  redirect("/admin/notices");
}

export async function setNoticeStatus(id: string, status: "draft" | "published"): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") updates.published_at = new Date().toISOString();

  await supabase.from("notices").update(updates).eq("id", id);

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}

export async function deleteNotice(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("notices")
    .select("attachment_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("notices").delete().eq("id", id);

  if (!error && existing?.attachment_path) {
    await deleteNoticeAttachment(existing.attachment_path);
  }

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}
