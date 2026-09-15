import "server-only";

import { createClient } from "@/lib/supabase/server";

const BUCKET = "management";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Uploads a validated portrait photo to the private "management" bucket
 * under a server-generated random filename — never the browser-supplied
 * original filename, which is not trusted as a storage identity.
 */
export async function uploadManagementPhoto(
  file: File
): Promise<{ path: string } | { error: string }> {
  const supabase = await createClient();
  const extension = EXTENSION_BY_MIME[file.type] ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: "Could not upload the photo. Please try again." };
  }
  return { path };
}

/**
 * Best-effort deletion of a management photo object. Failures here are
 * intentionally swallowed — losing track of an orphaned Storage object is
 * far less harmful than blocking the surrounding save/delete operation
 * (which has already succeeded at the database level by the time this
 * runs) on a Storage cleanup error.
 */
export async function deleteManagementPhoto(path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

/**
 * Signs a temporary, time-limited URL for a management photo. Works for
 * both published (public-read policy) and draft (admin-read policy)
 * photos, since signing itself is subject to the same storage.objects RLS
 * as any other read — the caller only ever gets a URL for objects it was
 * already allowed to read.
 */
export async function signManagementPhotoUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error || !data) return null;
  return data.signedUrl;
}

/** Signs URLs for several photo paths in parallel, preserving order. */
export async function signManagementPhotoUrls(
  paths: (string | null)[]
): Promise<(string | null)[]> {
  return Promise.all(paths.map((path) => signManagementPhotoUrl(path)));
}
