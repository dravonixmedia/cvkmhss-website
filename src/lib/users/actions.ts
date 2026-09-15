"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { validateProfileFields } from "@/lib/users/validation";

export interface ProfileFormState {
  error?: string;
}

const GENERIC_SAVE_ERROR = "Could not save this administrator. Please check the details and try again.";
const LOCKOUT_ERROR =
  "This is the last active Super Admin. Deactivating or demoting this account would lock " +
  "every administrator out of the backend, so it has been blocked. Promote another " +
  "administrator to Super Admin first if this change is intended.";

/**
 * True if `targetId` is currently the ONLY active super_admin — the one
 * account whose loss of super_admin status or active status would lock
 * every administrator out of /admin (RLS itself would then deny even a
 * super_admin re-promoting anyone, since is_super_admin() would be false
 * for everyone). Re-checked here immediately before the write, not
 * cached, so a race between two edits can't both pass the check.
 */
async function isLastActiveSuperAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>,
  targetId: string
): Promise<boolean> {
  const { data: target } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", targetId)
    .maybeSingle();

  if (!target || target.role !== "super_admin" || !target.is_active) {
    // Target isn't currently an active super_admin, so this change can't
    // possibly be the one removing the last one.
    return false;
  }

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin")
    .eq("is_active", true);

  return (count ?? 0) <= 1;
}

export async function updateProfile(
  id: string,
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  await requireSuperAdmin();

  const parsed = validateProfileFields(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();

  const wouldRemoveSuperAdminStatus =
    parsed.values.role !== "super_admin" || !parsed.values.isActive;

  if (wouldRemoveSuperAdminStatus && (await isLastActiveSuperAdmin(supabase, id))) {
    return { error: LOCKOUT_ERROR };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.values.fullName,
      role: parsed.values.role,
      is_active: parsed.values.isActive,
    })
    .eq("id", id);

  if (error) return { error: GENERIC_SAVE_ERROR };

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
