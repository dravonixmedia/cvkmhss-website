import type { NoticeItem } from "@/types";

/**
 * No verified notices have been supplied yet. Do not add fabricated entries
 * or fake PDF attachments — the Notices UI renders a clear empty state
 * until real content is published.
 */
export const notices: NoticeItem[] = [];

export function getImportantNotices(): NoticeItem[] {
  return notices.filter((notice) => notice.published && notice.important);
}

export function getPublishedNotices(): NoticeItem[] {
  return notices.filter((notice) => notice.published);
}
