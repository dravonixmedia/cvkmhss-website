import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { EventRow } from "@/lib/supabase/database.types";

export async function getAllEventsForAdmin(): Promise<EventRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) throw new Error("Could not load events.");
  return data ?? [];
}

export async function getEventByIdForAdmin(id: string): Promise<EventRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load this event.");
  return data;
}
