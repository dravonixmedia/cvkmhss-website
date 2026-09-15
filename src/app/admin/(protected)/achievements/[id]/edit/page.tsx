import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAchievementByIdForAdmin } from "@/lib/achievements/queries";
import { signAchievementImageUrl } from "@/lib/achievements/storage";
import { updateAchievement, setAchievementStatus } from "@/lib/achievements/actions";
import { AchievementForm } from "@/components/admin/AchievementForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Achievement",
  description: "Edit an Achievement.",
  path: "/admin/achievements",
  noIndex: true,
});

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const achievement = await getAchievementByIdForAdmin(id);
  if (!achievement) {
    notFound();
  }

  const imageUrl = await signAchievementImageUrl(achievement.image);
  const updateAction = updateAchievement.bind(null, achievement.id);
  const togglePublish = setAchievementStatus.bind(
    null,
    achievement.id,
    achievement.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit Achievement</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {achievement.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <form action={togglePublish}>
          <button
            type="submit"
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            {achievement.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <AchievementForm
          mode="edit"
          action={updateAction}
          initialValues={{
            slug: achievement.slug,
            title: achievement.title,
            category: achievement.category,
            achievementDate: achievement.achievement_date,
            description: achievement.description,
            imageUrl,
          }}
        />
      </div>
    </div>
  );
}
