import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

/**
 * Server-side Supabase client for Server Components, Route Handlers, and
 * Server Actions. Reconfigures the underlying fetch per call (it must —
 * it needs the current request's cookies), so create a fresh instance
 * per request rather than caching one globally.
 *
 * Uses only the public URL and publishable (anon) key: reads/writes are
 * authorized by the signed-in user's session plus RLS, not by an
 * elevated key. For the small set of operations that legitimately need
 * to bypass RLS (e.g. the super_admin bootstrap procedure), use
 * `createAdminClient` from `@/lib/supabase/admin` instead — never here.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getSupabasePublicConfig();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component, which cannot set cookies.
          // Safe to ignore because proxy.ts refreshes the session and
          // rewrites cookies on every request that needs it.
        }
      },
    },
  });
}
