import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getProfileByIdForSuperAdmin } from "@/lib/users/queries";
import { updateProfile } from "@/lib/users/actions";
import { UserEditForm } from "@/components/admin/UserEditForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Administrator",
  description: "Edit an admin backend user.",
  path: "/admin/users",
  noIndex: true,
});

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireSuperAdmin();
  const { id } = await params;

  const profile = await getProfileByIdForSuperAdmin(id);
  if (!profile) {
    notFound();
  }

  const updateAction = updateProfile.bind(null, profile.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Edit Administrator</h1>
      <p className="mt-1 text-sm text-slate">
        Changes to role and active status take effect on this user&apos;s next request.
      </p>

      <div className="mt-8">
        <UserEditForm
          action={updateAction}
          isSelf={profile.id === userId}
          initialValues={{
            fullName: profile.full_name,
            role: profile.role,
            isActive: profile.is_active,
          }}
        />
      </div>
    </div>
  );
}
