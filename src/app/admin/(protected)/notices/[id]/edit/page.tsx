import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getNoticeByIdForAdmin } from "@/lib/notices/queries";
import { signNoticeAttachmentUrl } from "@/lib/notices/storage";
import { updateNotice, setNoticeStatus } from "@/lib/notices/actions";
import { NoticeForm } from "@/components/admin/NoticeForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Notice",
  description: "Edit a Notice.",
  path: "/admin/notices",
  noIndex: true,
});

export default async function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const notice = await getNoticeByIdForAdmin(id);
  if (!notice) {
    notFound();
  }

  const attachmentUrl = await signNoticeAttachmentUrl(notice.attachment_path);
  const updateAction = updateNotice.bind(null, notice.id);
  const togglePublish = setNoticeStatus.bind(
    null,
    notice.id,
    notice.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit Notice</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {notice.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <form action={togglePublish}>
          <button
            type="submit"
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            {notice.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <NoticeForm
          mode="edit"
          action={updateAction}
          initialValues={{
            slug: notice.slug,
            title: notice.title,
            category: notice.category,
            noticeDate: notice.notice_date,
            description: notice.description,
            expiryDate: notice.expiry_date ?? "",
            important: notice.important,
            attachmentUrl,
          }}
        />
      </div>
    </div>
  );
}
