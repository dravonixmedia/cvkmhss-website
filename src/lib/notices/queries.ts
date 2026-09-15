import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { NoticeRow } from "@/lib/supabase/database.types";

export async function getAllNoticesForAdmin(): Promise<NoticeRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("notice_date", { ascending: false });

  if (error) throw new Error("Could not load notices.");
  return data ?? [];
}

export async function getNoticeByIdForAdmin(id: string): Promise<NoticeRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("notices").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load this notice.");
  return data;
}
