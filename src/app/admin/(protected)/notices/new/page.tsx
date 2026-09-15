import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { createNotice } from "@/lib/notices/actions";
import { NoticeForm } from "@/components/admin/NoticeForm";

export const metadata: Metadata = buildMetadata({
  title: "Add Notice",
  description: "Add a new Notice.",
  path: "/admin/notices/new",
  noIndex: true,
});

export default async function NewNoticePage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add Notice</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this notice visible on the public Notices page
        immediately.
      </p>

      <div className="mt-8">
        <NoticeForm
          mode="create"
          action={createNotice}
          initialValues={{
            title: "",
            category: "general",
            noticeDate: "",
            description: "",
            expiryDate: "",
            important: false,
            attachmentUrl: null,
          }}
        />
      </div>
    </div>
  );
}
