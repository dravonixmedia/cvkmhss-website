import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllDownloadsForAdmin } from "@/lib/downloads/queries";
import { deleteDownload, setDownloadStatus } from "@/lib/downloads/actions";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";

export const metadata: Metadata = buildMetadata({
  title: "Downloads",
  description: "Manage CVKM HSS Downloads.",
  path: "/admin/downloads",
  noIndex: true,
});

export default async function AdminDownloadsListPage() {
  await requireAdmin();

  const downloads = await getAllDownloadsForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Downloads</h1>
          <p className="mt-1 text-sm text-slate">
            Published downloads appear on the public Downloads page.
          </p>
        </div>
        <Link
          href="/admin/downloads/new"
          className="bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark"
        >
          + Add Download
        </Link>
      </div>

      {downloads.length === 0 ? (
        <div className="mt-10 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No downloads yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Add the first document to get started. Drafts stay hidden from the public site until
            published.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Title &amp; Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((item) => {
                const togglePublish = setDownloadStatus.bind(
                  null,
                  item.id,
                  item.status === "published" ? "draft" : "published"
                );
                const remove = deleteDownload.bind(null, item.id);

                return (
                  <tr key={item.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{item.title}</p>
                      <p className="text-xs text-slate">{item.category}</p>
                    </td>
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
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                        <Link
                          href={`/admin/downloads/${item.id}/edit`}
                          className="font-semibold tracking-wide text-navy uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={togglePublish}>
                          <button
                            type="submit"
                            className="font-semibold tracking-wide text-navy uppercase hover:underline"
                          >
                            {item.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <ConfirmDeleteForm action={remove} itemLabel={item.title} />
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
