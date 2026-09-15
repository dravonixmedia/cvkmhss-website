import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { createDownload } from "@/lib/downloads/actions";
import { DownloadForm } from "@/components/admin/DownloadForm";

export const metadata: Metadata = buildMetadata({
  title: "Add Download",
  description: "Add a new Download.",
  path: "/admin/downloads/new",
  noIndex: true,
});

export default async function NewDownloadPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add Download</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this document available on the public
        Downloads page immediately.
      </p>

      <div className="mt-8">
        <DownloadForm
          mode="create"
          action={createDownload}
          initialValues={{ title: "", category: "General", description: "", documentUrl: null }}
        />
      </div>
    </div>
  );
}
