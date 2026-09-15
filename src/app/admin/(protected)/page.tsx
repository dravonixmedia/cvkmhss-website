import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getContentOverview, getRecentContent } from "@/lib/dashboard/queries";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  description: "CVKM HSS administration dashboard.",
  path: "/admin",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const { profile, email } = await requireAdmin();
  const roleLabel = profile.role === "super_admin" ? "Super Admin" : "Editor";

  const [overview, recent] = await Promise.all([getContentOverview(), getRecentContent(6)]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">
        Welcome, {profile.full_name || email}
      </h1>
      <p className="mt-1 text-sm text-slate">
        Signed in as <span className="font-medium text-charcoal">{roleLabel}</span>. Manage the
        school website&apos;s content, and{" "}
        {profile.role === "super_admin" ? "administration" : "settings"}, from here.
      </p>

      <section className="mt-10">
        <h2 className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
          Content Overview
        </h2>
        <div className="mt-4 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Draft</th>
                <th className="px-4 py-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {overview.map((item) => (
                <tr key={item.label} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <Link href={item.href} className="font-medium text-charcoal hover:text-navy hover:underline">
                      {item.label}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{item.published}</td>
                  <td className="px-4 py-3 text-slate">{item.draft}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={item.addHref}
                      className="text-xs font-semibold tracking-wide text-navy uppercase hover:underline"
                    >
                      + {item.addLabel}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
          Recent Content
        </h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate">
            No content has been added yet. Use Quick Management above to add the first item.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-border bg-paper">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={`${item.domainLabel}-${item.id}`} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <Link href={item.editHref} className="font-medium text-charcoal hover:text-navy hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">{item.domainLabel}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                          item.status === "published"
                            ? "border-navy text-navy"
                            : "border-slate/40 text-slate"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {new Date(item.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
