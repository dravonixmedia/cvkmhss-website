import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllManagementMembersForAdmin } from "@/lib/management/queries";
import { createManagementMember } from "@/lib/management/actions";
import { ManagementForm } from "@/components/admin/ManagementForm";

export const metadata: Metadata = buildMetadata({
  title: "Add Management Member",
  description: "Add a new Management & Leadership profile.",
  path: "/admin/management/new",
  noIndex: true,
});

export default async function NewManagementMemberPage() {
  await requireAdmin();

  const existing = await getAllManagementMembersForAdmin();
  const nextDisplayOrder = existing.reduce((max, member) => Math.max(max, member.display_order), -1) + 1;

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add Management Member</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this member visible on the public About page
        immediately.
      </p>

      <div className="mt-8">
        <ManagementForm
          mode="create"
          action={createManagementMember}
          initialValues={{
            fullName: "",
            designation: "",
            shortBio: "",
            displayOrder: nextDisplayOrder,
            isFeatured: false,
            photoUrl: null,
          }}
        />
      </div>
    </div>
  );
}
