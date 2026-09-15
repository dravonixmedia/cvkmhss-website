import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Generic Storage helpers shared by every CMS domain's own storage.ts
 * (news/events/achievements/gallery/downloads/notices). Each domain wraps
 * these with its own bucket name and mime/extension map — see
 * src/lib/management/storage.ts for the pattern this generalizes.
 */

export async function uploadCmsFile(
  bucket: string,
  file: File,
  extensionByMime: Record<string, string>,
  { upsertPath, pathPrefix }: { upsertPath?: string; pathPrefix?: string } = {}
): Promise<{ path: string } | { error: string }> {
  const supabase = await createClient();
  const extension = extensionByMime[file.type] ?? "bin";
  const generatedName = `${crypto.randomUUID()}.${extension}`;
  const path = upsertPath ?? (pathPrefix ? `${pathPrefix}/${generatedName}` : generatedName);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: Boolean(upsertPath),
  });

  if (error) {
    return { error: "Could not upload the file. Please try again." };
  }
  return { path };
}

/**
 * Best-effort delete — a Storage cleanup failure never blocks the
 * surrounding database save/delete, which has already succeeded by the
 * time this runs.
 */
export async function deleteCmsFile(bucket: string, path: string | null): Promise<void> {
  if (!path) return;
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([path]);
}

export async function deleteCmsFiles(bucket: string, paths: (string | null)[]): Promise<void> {
  const real = paths.filter((p): p is string => Boolean(p));
  if (real.length === 0) return;
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove(real);
}

/**
 * Signs a temporary URL for a private-bucket object. Works for both
 * published (public-read policy) and draft (admin-read policy) assets —
 * signing itself is subject to the same storage.objects RLS as any other
 * read, so the caller only ever gets a URL for objects it could already
 * read.
 */
export async function signCmsFileUrl(
  bucket: string,
  path: string | null,
  expiresIn = 3600
): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function signCmsFileUrls(
  bucket: string,
  paths: (string | null)[],
  expiresIn = 3600
): Promise<(string | null)[]> {
  return Promise.all(paths.map((path) => signCmsFileUrl(bucket, path, expiresIn)));
}
