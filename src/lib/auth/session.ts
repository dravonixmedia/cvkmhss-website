import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/database.types";

export interface AuthContext {
  userId: string;
  email: string | null;
  profile: ProfileRow;
}

/**
 * Data Access Layer entry point for the admin backend. Verifies the
 * session against the Supabase Auth server (via getClaims(), which
 * validates the JWT signature — never trust a cookie's presence alone)
 * and loads the application-level `profiles` row for that user.
 *
 * Returns null when there is no valid session OR no profile row exists
 * for that user (an authenticated Supabase Auth user without a profile
 * has no admin access at all — see requireUser below).
 *
 * Wrapped in React's cache() so multiple calls during the same render
 * pass (layout + page + nested components) only hit Supabase once.
 */
export const getAuthContext = cache(async (): Promise<AuthContext | null> => {
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    // No Supabase project connected yet (see docs/SUPABASE_SETUP.md).
    // Treat as "no session" so /admin/login still renders and protected
    // routes still redirect there, instead of throwing a 500.
    return null;
  }

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const userId = data.claims.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;

  return {
    userId,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
    profile,
  };
});

/**
 * Requires any authenticated Supabase Auth user WITH a profile row.
 * Redirects to /admin/login otherwise. Does NOT check is_active or role
 * — use requireAdmin for that. Exists mainly as a building block for
 * requireAdmin/requireSuperAdmin.
 */
export async function requireUser(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) {
    redirect("/admin/login");
  }
  return context;
}

/**
 * Requires an authenticated user with an active admin profile
 * (super_admin or editor). This is the standard guard for every
 * protected admin route/action. An inactive profile is signed out
 * server-side (not just denied) so the stale session cookie doesn't
 * linger.
 */
export async function requireAdmin(): Promise<AuthContext> {
  const context = await requireUser();

  if (!context.profile.is_active) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return context;
}

/** Requires an authenticated, active user with the super_admin role. */
export async function requireSuperAdmin(): Promise<AuthContext> {
  const context = await requireAdmin();

  if (context.profile.role !== "super_admin") {
    redirect("/admin");
  }

  return context;
}
