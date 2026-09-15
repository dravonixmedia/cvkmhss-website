import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  description: "CVKM HSS administration dashboard.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const { profile, email } = await requireAdmin();
  const roleLabel = profile.role === "super_admin" ? "Super Admin" : "Editor";

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-semibold text-navy">
        Welcome, {profile.full_name || email}
      </h1>
      <p className="mt-1 text-sm text-slate">
        Signed in as <span className="font-medium text-charcoal">{roleLabel}</span>.
      </p>

      <div className="mt-8 border border-border bg-paper p-6">
        <h2 className="font-heading text-sm font-semibold text-navy">
          Content management is not available yet
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate">
          This is the authentication and security foundation for the admin backend
          (Phase 2A). News, Events, Achievements, Notices, Downloads, and Gallery
          management — along with user administration and settings — arrive in
          Phase 2B, once the connected Supabase project and this foundation have been
          reviewed and approved.
        </p>
      </div>
    </div>
  );
}
