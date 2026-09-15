import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllNoticesForAdmin } from "@/lib/notices/queries";
import { deleteNotice, setNoticeStatus } from "@/lib/notices/actions";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";

export const metadata: Metadata = buildMetadata({
  title: "Notices",
  description: "Manage CVKM HSS Notices.",
  path: "/admin/notices",
  noIndex: true,
});

export default async function AdminNoticesListPage() {
  await requireAdmin();

  const notices = await getAllNoticesForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Notices</h1>
          <p className="mt-1 text-sm text-slate">Published notices appear on the public Notices page.</p>
        </div>
        <Link
          href="/admin/notices/new"
          className="bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark"
        >
          + Add Notice
        </Link>
      </div>

      {notices.length === 0 ? (
        <div className="mt-10 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No notices yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Add the first notice to get started. Drafts stay hidden from the public site until published.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Title &amp; Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Important</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => {
                const togglePublish = setNoticeStatus.bind(
                  null,
                  notice.id,
                  notice.status === "published" ? "draft" : "published"
                );
                const remove = deleteNotice.bind(null, notice.id);

                return (
                  <tr key={notice.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{notice.title}</p>
                      <p className="text-xs text-slate capitalize">{notice.category}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {new Date(notice.notice_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {notice.important ? (
                        <span className="border border-gold px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gold uppercase">
                          Important
                        </span>
                      ) : (
                        <span className="text-border">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                          notice.status === "published"
                            ? "border-navy text-navy"
                            : "border-slate/40 text-slate"
                        }`}
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                        <Link
                          href={`/admin/notices/${notice.id}/edit`}
                          className="font-semibold tracking-wide text-navy uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={togglePublish}>
                          <button
                            type="submit"
                            className="font-semibold tracking-wide text-navy uppercase hover:underline"
                          >
                            {notice.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <ConfirmDeleteForm action={remove} itemLabel={notice.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
