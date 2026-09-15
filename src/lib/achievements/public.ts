import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signAchievementImageUrls } from "@/lib/achievements/storage";
import type { AchievementRow } from "@/lib/supabase/database.types";
import type { AchievementItem } from "@/types";

function toAchievementItem(row: AchievementRow, imageUrl: string | null): AchievementItem {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.achievement_date,
    description: row.description,
    image: imageUrl ?? undefined,
  };
}

/** Public-safe: never throws — a query failure degrades to an empty list. */
export async function getPublishedAchievements(): Promise<AchievementItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("status", "published")
      .order("achievement_date", { ascending: false });

    if (error) {
      console.error("Failed to load published achievements:", error.message);
      return [];
    }
    const rows = data ?? [];
    const imageUrls = await signAchievementImageUrls(rows.map((row) => row.image));
    return rows.map((row, index) => toAchievementItem(row, imageUrls[index]));
  } catch (err) {
    console.error("Achievements query failed:", err);
    return [];
  }
}
