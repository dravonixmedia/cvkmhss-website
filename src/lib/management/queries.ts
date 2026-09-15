import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ManagementMemberRow } from "@/lib/supabase/database.types";

/**
 * Public-safe: returns published management members only, ordered for
 * display. RLS enforces the published-only restriction independently of
 * this query — this ordering is a presentation concern, not a security
 * boundary. Never throws: a Supabase/query failure is logged server-side
 * and surfaces as an empty list, so the About page degrades gracefully
 * instead of crashing for a public visitor.
 */
export async function getPublishedManagementMembers(): Promise<ManagementMemberRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("management_members")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load published management members:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Management members query failed:", err);
    return [];
  }
}

/**
 * Admin-only in effect (RLS restricts non-admin callers to published rows
 * only, same as the public query above) — used by the protected
 * /admin/management routes, which already call requireAdmin() before
 * reaching this. Returns every member regardless of status.
 */
export async function getAllManagementMembersForAdmin(): Promise<ManagementMemberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("management_members")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Could not load management members.");
  }
  return data ?? [];
}

export async function getManagementMemberById(id: string): Promise<ManagementMemberRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("management_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Could not load this member.");
  }
  return data;
}
