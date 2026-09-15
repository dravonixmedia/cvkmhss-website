import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { DownloadRow } from "@/lib/supabase/database.types";

export async function getAllDownloadsForAdmin(): Promise<DownloadRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("downloads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Could not load downloads.");
  return data ?? [];
}

export async function getDownloadByIdForAdmin(id: string): Promise<DownloadRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("downloads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load this download.");
  return data;
}
