import type { DownloadCategory, DownloadItem } from "@/types";

export const downloadCategories: DownloadCategory[] = [
  "Academic",
  "Admissions",
  "Notices",
  "Forms",
  "General",
];

/**
 * No verified documents have been supplied yet. Do not add fabricated
 * downloads — the Downloads UI renders a clear empty state per category
 * until real files are published.
 */
export const downloads: DownloadItem[] = [];
