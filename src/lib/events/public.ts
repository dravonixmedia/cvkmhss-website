import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signEventImageUrls } from "@/lib/events/storage";
import { formatDisplayTime } from "@/lib/date";
import type { EventRow } from "@/lib/supabase/database.types";
import type { EventItem } from "@/types";

function toEventItem(row: EventRow, imageUrl: string | null): EventItem {
  return {
    slug: row.slug,
    title: row.title,
    date: row.event_date,
    startTime: row.start_time ? formatDisplayTime(row.start_time) : undefined,
    endTime: row.end_time ? formatDisplayTime(row.end_time) : undefined,
    location: row.location,
    description: row.description,
    image: imageUrl ?? undefined,
  };
}

/** Public-safe: never throws — a query failure degrades to an empty list. */
export async function getPublishedEvents(): Promise<EventItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Failed to load published events:", error.message);
      return [];
    }
    const rows = data ?? [];
    const imageUrls = await signEventImageUrls(rows.map((row) => row.image));
    return rows.map((row, index) => toEventItem(row, imageUrls[index]));
  } catch (err) {
    console.error("Events query failed:", err);
    return [];
  }
}

/** Splits an already-fetched list into upcoming/past, matching the original data/events.ts helpers. */
export function splitEventsByDate(events: EventItem[], referenceDate: Date = new Date()) {
  const upcoming = events
    .filter((event) => new Date(event.date) >= referenceDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events
    .filter((event) => new Date(event.date) < referenceDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { upcoming, past };
}
