import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
  return slug || "item";
}

type SluggedTable = "news" | "events" | "achievements" | "notices" | "gallery_albums";

/**
 * Derives a unique slug from `baseSlug` for the given table, appending
 * `-2`, `-3`, etc. on collision. Not perfectly race-safe under heavy
 * concurrent writes, but this is a low-concurrency school admin tool
 * (at most a couple of admins), so a pre-check SELECT loop is simpler
 * and adequate rather than catch-and-retry on a DB constraint violation.
 */
export async function generateUniqueSlug(
  supabase: SupabaseClient<Database>,
  table: SluggedTable,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(baseSlug);
  let candidate = base;

  for (let attempt = 2; attempt <= 30; attempt++) {
    let query = supabase.from(table).select("id").eq("slug", candidate).limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query;
    if (!data || data.length === 0) return candidate;
    candidate = `${base}-${attempt}`;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}
