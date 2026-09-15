import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getDownloadByIdForAdmin } from "@/lib/downloads/queries";
import { signDownloadDocumentUrl } from "@/lib/downloads/storage";
import { updateDownload, setDownloadStatus } from "@/lib/downloads/actions";
import { DownloadForm } from "@/components/admin/DownloadForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Download",
  description: "Edit a Download.",
  path: "/admin/downloads",
  noIndex: true,
});

export default async function EditDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const download = await getDownloadByIdForAdmin(id);
  if (!download) {
    notFound();
  }

  const documentUrl = await signDownloadDocumentUrl(download.file_path);
  const updateAction = updateDownload.bind(null, download.id);
  const togglePublish = setDownloadStatus.bind(
    null,
    download.id,
    download.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit Download</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {download.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <form action={togglePublish}>
          <button
            type="submit"
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            {download.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <DownloadForm
          mode="edit"
          action={updateAction}
          initialValues={{
            title: download.title,
            category: download.category,
            description: download.description ?? "",
            documentUrl,
          }}
        />
      </div>
    </div>
  );
}
