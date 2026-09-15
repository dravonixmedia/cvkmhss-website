import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { createAchievement } from "@/lib/achievements/actions";
import { AchievementForm } from "@/components/admin/AchievementForm";

export const metadata: Metadata = buildMetadata({
  title: "Add Achievement",
  description: "Add a new Achievement.",
  path: "/admin/achievements/new",
  noIndex: true,
});

export default async function NewAchievementPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add Achievement</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this achievement visible on the public
        Achievements page immediately. A URL slug is generated automatically from the title.
      </p>

      <div className="mt-8">
        <AchievementForm
          mode="create"
          action={createAchievement}
          initialValues={{
            title: "",
            category: "academics",
            achievementDate: "",
            description: "",
            imageUrl: null,
          }}
        />
      </div>
    </div>
  );
}
