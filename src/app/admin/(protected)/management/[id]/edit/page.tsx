import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getManagementMemberById } from "@/lib/management/queries";
import { signManagementPhotoUrl } from "@/lib/management/storage";
import { updateManagementMember, setManagementMemberStatus } from "@/lib/management/actions";
import { ManagementForm } from "@/components/admin/ManagementForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Management Member",
  description: "Edit a Management & Leadership profile.",
  path: "/admin/management",
  noIndex: true,
});

export default async function EditManagementMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const member = await getManagementMemberById(id);
  if (!member) {
    notFound();
  }

  const photoUrl = await signManagementPhotoUrl(member.photo_path);
  const updateAction = updateManagementMember.bind(null, member.id);
  const togglePublish = setManagementMemberStatus.bind(
    null,
    member.id,
    member.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit Management Member</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {member.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <form action={togglePublish}>
          <button
            type="submit"
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            {member.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <ManagementForm
          mode="edit"
          action={updateAction}
          initialValues={{
            fullName: member.full_name,
            designation: member.designation,
            shortBio: member.short_bio ?? "",
            displayOrder: member.display_order,
            isFeatured: member.is_featured,
            photoUrl,
          }}
        />
      </div>
    </div>
  );
}
