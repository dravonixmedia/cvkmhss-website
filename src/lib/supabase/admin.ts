import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely and
 * can call the Auth admin API (create/invite/delete users). This is the
 * ONLY client in this codebase that may use SUPABASE_SERVICE_ROLE_KEY.
 *
 * Guardrails:
 *   - `import "server-only"` above makes any accidental import from a
 *     Client Component fail at build time.
 *   - This module reads `process.env.SUPABASE_SERVICE_ROLE_KEY` directly
 *     (never `NEXT_PUBLIC_*`), so it is never bundled for the browser.
 *   - Not used by any request-serving route in Phase 2A. It exists so the
 *     first-super_admin bootstrap procedure (see docs/SUPABASE_SETUP.md)
 *     and future admin-invitation flows have a correct, safe client to
 *     call, instead of each script inventing its own.
 *   - Do not use this client for routine CMS reads/writes — those should
 *     go through `@/lib/supabase/server` so RLS and the signed-in user's
 *     identity stay the actual authorization boundary.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL " +
        "and SUPABASE_SERVICE_ROLE_KEY (server-only — see .env.example)."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
