import type { AchievementCategory, AchievementItem } from "@/types";

export const achievementCategories: { id: AchievementCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "academics", label: "Academic Achievements" },
  { id: "sports", label: "Sports Achievements" },
  { id: "arts", label: "Arts & Cultural Achievements" },
  { id: "innovation", label: "Innovation & Projects" },
  { id: "competitions", label: "Competitions" },
  { id: "recognitions", label: "School Recognitions" },
];

/**
 * No verified achievements have been supplied yet. Do not add entries here
 * without confirmed details from the school — the achievements UI renders
 * a clear empty state until this array is populated.
 */
export const achievements: AchievementItem[] = [];
