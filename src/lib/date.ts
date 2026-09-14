/** Splits an ISO date string into a large day number and short month label for calendar-style typography. */
export function formatEventDate(dateStr: string): { day: string; month: string } {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}
