"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { validateDownloadFields, validateDownloadDocument } from "@/lib/downloads/validation";
import { uploadDownloadDocument, deleteDownloadDocument } from "@/lib/downloads/storage";

export interface DownloadFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this download. Please check the details and try again.";

function resolveStatusFromIntent(formData: FormData): "draft" | "published" {
  return formData.get("intent") === "publish" ? "published" : "draft";
}

export async function createDownload(
  _prevState: DownloadFormState,
  formData: FormData
): Promise<DownloadFormState> {
  const admin = await requireAdmin();

  const parsed = validateDownloadFields(formData);
  if ("error" in parsed) return parsed;

  const file = formData.get("document");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "A document file is required." };
  }
  const fileValidation = validateDownloadDocument(file);
  if ("error" in fileValidation) return fileValidation;

  const uploaded = await uploadDownloadDocument(file);
  if ("error" in uploaded) return uploaded;

  const status = resolveStatusFromIntent(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("downloads").insert({
    title: parsed.values.title,
    category: parsed.values.category,
    description: parsed.values.description,
    file_path: uploaded.path,
    status,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: admin.profile.id,
    updated_by: admin.profile.id,
  });

  if (error) {
    await deleteDownloadDocument(uploaded.path);
    return { error: GENERIC_SAVE_ERROR };
  }

  revalidatePath("/admin/downloads");
  revalidatePath("/downloads");
  redirect("/admin/downloads");
}

export async function updateDownload(
  id: string,
  _prevState: DownloadFormState,
  formData: FormData
): Promise<DownloadFormState> {
  const admin = await requireAdmin();

  const parsed = validateDownloadFields(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("downloads")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  let filePath = existing?.file_path ?? null;
  const file = formData.get("document");
  if (file instanceof File && file.size > 0) {
    const fileValidation = validateDownloadDocument(file);
    if ("error" in fileValidation) return fileValidation;
    const uploaded = await uploadDownloadDocument(file);
    if ("error" in uploaded) return uploaded;
    filePath = uploaded.path;
  }

  if (!filePath) {
    return { error: "A document file is required." };
  }

  const { error } = await supabase
    .from("downloads")
    .update({
      title: parsed.values.title,
      category: parsed.values.category,
      description: parsed.values.description,
      file_path: filePath,
      updated_by: admin.profile.id,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.file_path && filePath !== existing.file_path) {
    await deleteDownloadDocument(existing.file_path);
  }

  revalidatePath("/admin/downloads");
  revalidatePath("/downloads");
  redirect("/admin/downloads");
}

export async function setDownloadStatus(id: string, status: "draft" | "published"): Promise<void> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const updates: { status: "draft" | "published"; updated_by: string; published_at?: string } = {
    status,
    updated_by: admin.profile.id,
  };
  if (status === "published") updates.published_at = new Date().toISOString();

  await supabase.from("downloads").update(updates).eq("id", id);

  revalidatePath("/admin/downloads");
  revalidatePath("/downloads");
}

export async function deleteDownload(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("downloads")
    .select("file_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("downloads").delete().eq("id", id);

  if (!error && existing?.file_path) {
    await deleteDownloadDocument(existing.file_path);
  }

  revalidatePath("/admin/downloads");
  revalidatePath("/downloads");
}
