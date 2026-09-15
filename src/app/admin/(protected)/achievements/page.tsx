import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllAchievementsForAdmin } from "@/lib/achievements/queries";
import { signAchievementImageUrls } from "@/lib/achievements/storage";
import { deleteAchievement, setAchievementStatus } from "@/lib/achievements/actions";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";

export const metadata: Metadata = buildMetadata({
  title: "Achievements",
  description: "Manage CVKM HSS Achievements.",
  path: "/admin/achievements",
  noIndex: true,
});

export default async function AdminAchievementsListPage() {
  await requireAdmin();

  const achievements = await getAllAchievementsForAdmin();
  const imageUrls = await signAchievementImageUrls(achievements.map((a) => a.image));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Achievements</h1>
          <p className="mt-1 text-sm text-slate">
            Published achievements appear on the public Achievements page.
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark"
        >
          + Add Achievement
        </Link>
      </div>

      {achievements.length === 0 ? (
        <div className="mt-10 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No achievements yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Add the first achievement to get started. Drafts stay hidden from the public site until
            published.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title &amp; Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((item, index) => {
                const imageUrl = imageUrls[index];
                const togglePublish = setAchievementStatus.bind(
                  null,
                  item.id,
                  item.status === "published" ? "draft" : "published"
                );
                const remove = deleteAchievement.bind(null, item.id);

                return (
                  <tr key={item.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                        <img src={imageUrl} alt="" className="h-14 w-20 border border-border object-cover" />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center border border-dashed border-border text-[10px] text-slate">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{item.title}</p>
                      <p className="text-xs text-slate capitalize">{item.category}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {new Date(item.achievement_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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
                          href={`/admin/achievements/${item.id}/edit`}
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
