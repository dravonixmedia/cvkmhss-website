import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllManagementMembersForAdmin } from "@/lib/management/queries";
import { signManagementPhotoUrls } from "@/lib/management/storage";
import {
  deleteManagementMember,
  moveManagementMember,
  setManagementMemberStatus,
} from "@/lib/management/actions";
import { DeleteMemberForm } from "@/components/admin/DeleteMemberForm";

export const metadata: Metadata = buildMetadata({
  title: "Management & Leadership",
  description: "Manage CVKM HSS Management & Leadership profiles.",
  path: "/admin/management",
  noIndex: true,
});

export default async function AdminManagementListPage() {
  await requireAdmin();

  const members = await getAllManagementMembersForAdmin();
  const photoUrls = await signManagementPhotoUrls(members.map((member) => member.photo_path));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Management &amp; Leadership</h1>
          <p className="mt-1 text-sm text-slate">
            Published members appear on the public About page, ordered by display order.
          </p>
        </div>
        <Link
          href="/admin/management/new"
          className="bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark"
        >
          + Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="mt-10 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No management members yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Add the first member to get started. Drafts stay hidden from the public About page until
            published.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Name &amp; Designation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const photoUrl = photoUrls[index];
                const isFirst = index === 0;
                const isLast = index === members.length - 1;
                const togglePublish = setManagementMemberStatus.bind(
                  null,
                  member.id,
                  member.status === "published" ? "draft" : "published"
                );
                const moveUp = moveManagementMember.bind(null, member.id, "up");
                const moveDown = moveManagementMember.bind(null, member.id, "down");
                const remove = deleteManagementMember.bind(null, member.id);

                return (
                  <tr key={member.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3">
                      {photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                        <img
                          src={photoUrl}
                          alt=""
                          className="h-14 w-14 border border-border object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center border border-dashed border-border text-[10px] text-slate">
                          No photo
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{member.full_name}</p>
                      <p className="text-xs text-slate">{member.designation}</p>
                      {member.is_featured && (
                        <span className="mt-1 inline-block border border-gold px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gold uppercase">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                          member.status === "published"
                            ? "border-navy text-navy"
                            : "border-slate/40 text-slate"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal">
                      <div className="flex items-center gap-1">
                        <span>{member.display_order}</span>
                        <div className="ml-1 flex flex-col">
                          <form action={moveUp}>
                            <button
                              type="submit"
                              disabled={isFirst}
                              aria-label={`Move ${member.full_name} up`}
                              className="block leading-none text-slate disabled:opacity-30"
                            >
                              ▲
                            </button>
                          </form>
                          <form action={moveDown}>
                            <button
                              type="submit"
                              disabled={isLast}
                              aria-label={`Move ${member.full_name} down`}
                              className="block leading-none text-slate disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </form>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {new Date(member.updated_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                        <Link
                          href={`/admin/management/${member.id}/edit`}
                          className="font-semibold tracking-wide text-navy uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={togglePublish}>
                          <button
                            type="submit"
                            className="font-semibold tracking-wide text-navy uppercase hover:underline"
                          >
                            {member.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <DeleteMemberForm action={remove} memberName={member.full_name} />
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
