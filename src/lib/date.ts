/** Splits an ISO date string into a large day number and short month label for calendar-style typography. */
export function formatEventDate(dateStr: string): { day: string; month: string } {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}

/** Formats an ISO date/timestamp string as a readable "15 September 2026" style date. */
export function formatDisplayDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Formats a Postgres "time" value ("14:30:00") as "2:30 PM". */
export function formatDisplayTime(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hoursStr), Number(minutesStr), 0, 0);
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
