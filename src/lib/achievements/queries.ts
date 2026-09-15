import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AchievementRow } from "@/lib/supabase/database.types";

export async function getAllAchievementsForAdmin(): Promise<AchievementRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("achievement_date", { ascending: false });

  if (error) throw new Error("Could not load achievements.");
  return data ?? [];
}

export async function getAchievementByIdForAdmin(id: string): Promise<AchievementRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("achievements").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load this achievement.");
  return data;
}
