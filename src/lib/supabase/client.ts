"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

/**
 * Browser-side Supabase client for Client Components. Only ever uses the
 * public URL and publishable (anon) key — never the service role key.
 *
 * `createBrowserClient` already uses a singleton pattern internally, so
 * calling this multiple times does not create multiple connections.
 */
export function createClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  return createBrowserClient<Database>(url, publishableKey);
}
