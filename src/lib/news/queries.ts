import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { NewsRow } from "@/lib/supabase/database.types";

export async function getAllNewsForAdmin(): Promise<NewsRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error("Could not load news articles.");
  return data ?? [];
}

export async function getNewsByIdForAdmin(id: string): Promise<NewsRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load this article.");
  return data;
}
