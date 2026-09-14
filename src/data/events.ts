import type { EventItem } from "@/types";

/**
 * No verified events have been supplied yet. Do not add fabricated entries —
 * the Events UI renders a clear empty state until real content is published.
 */
export const events: EventItem[] = [];

export function getUpcomingEvents(referenceDate: Date = new Date()): EventItem[] {
  return events
    .filter((event) => new Date(event.date) >= referenceDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents(referenceDate: Date = new Date()): EventItem[] {
  return events
    .filter((event) => new Date(event.date) < referenceDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
