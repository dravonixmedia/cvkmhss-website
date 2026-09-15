import type { Metadata } from "next";
import Link from "next/link";
import { requireSuperAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllProfilesForSuperAdmin } from "@/lib/users/queries";

export const metadata: Metadata = buildMetadata({
  title: "Users",
  description: "Manage CVKM HSS admin backend users.",
  path: "/admin/users",
  noIndex: true,
});

export default async function AdminUsersListPage() {
  const { userId, email } = await requireSuperAdmin();

  const profiles = await getAllProfilesForSuperAdmin();
  const activeSuperAdminCount = profiles.filter(
    (p) => p.role === "super_admin" && p.is_active
  ).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Users</h1>
          <p className="mt-1 text-sm text-slate">
            Administrators who can sign in to this backend. Super Admin only.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-paper">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
              <th className="px-4 py-3">Name &amp; Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const isSelf = profile.id === userId;
              const isOnlyActiveSuperAdmin =
                profile.role === "super_admin" && profile.is_active && activeSuperAdminCount <= 1;

              return (
                <tr key={profile.id} className="border-b border-border last:border-b-0 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">
                      {profile.full_name || "(no name set)"}
                      {isSelf && (
                        <span className="ml-2 text-xs font-normal text-slate">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate">{isSelf ? email : "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                        profile.role === "super_admin"
                          ? "border-gold text-gold"
                          : "border-slate/40 text-slate"
                      }`}
                    >
                      {profile.role === "super_admin" ? "Super Admin" : "Editor"}
                    </span>
                    {isOnlyActiveSuperAdmin && (
                      <p className="mt-1 text-[11px] text-slate">Only active Super Admin</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                        profile.is_active ? "border-navy text-navy" : "border-slate/40 text-slate"
                      }`}
                    >
                      {profile.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {new Date(profile.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">
                    {new Date(profile.updated_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${profile.id}/edit`}
                      className="text-xs font-semibold tracking-wide text-navy uppercase hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate">
        Other administrators&apos; email addresses aren&apos;t stored in this app and require
        Supabase Auth Admin access to display — see the note below.
      </p>

      <div className="mt-10 border border-dashed border-border bg-off-white p-6">
        <h2 className="font-heading text-sm font-semibold text-navy">Add an administrator</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
          Creating a new sign-in requires Supabase&apos;s Auth Admin API, which needs a privileged
          server credential this deployment does not currently use for request-serving code (by
          design — see <code className="text-xs">docs/SUPABASE_SETUP.md</code>). To add an
          administrator today: create the Auth user in the Supabase Dashboard
          (Authentication → Users → Add user), then insert their <code className="text-xs">profiles</code>{" "}
          row via the SQL Editor. Full steps are in{" "}
          <code className="text-xs">docs/SUPABASE_SETUP.md</code> §5. Once created, manage their
          role and active status here.
        </p>
      </div>
    </div>
  );
}
