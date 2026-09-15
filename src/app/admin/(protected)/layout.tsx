import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Everything under this route group requires an authenticated, active
 * admin profile. requireAdmin() redirects to /admin/login otherwise.
 *
 * Per Next.js's own guidance on auth checks in layouts (layouts don't
 * re-run on every client-side navigation within the same segment), this
 * layout check is a first line of defense for the shell chrome, not the
 * only one — individual pages call requireAdmin()/requireSuperAdmin()
 * again themselves (cheap: deduped per-request via React cache()) so the
 * check happens close to whatever data that page actually renders.
 */
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { profile, email } = await requireAdmin();

  return (
    <AdminShell profile={profile} email={email}>
      {children}
    </AdminShell>
  );
}
