import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signNoticeAttachmentUrls } from "@/lib/notices/storage";
import { formatDisplayDate } from "@/lib/date";
import type { NoticeRow } from "@/lib/supabase/database.types";
import type { NoticeItem } from "@/types";

function toNoticeItem(row: NoticeRow, attachmentUrl: string | null): NoticeItem {
  return {
    slug: row.slug,
    title: row.title,
    date: formatDisplayDate(row.notice_date),
    category: row.category,
    description: row.description,
    attachmentUrl: attachmentUrl ?? undefined,
    expiryDate: row.expiry_date ?? undefined,
    important: row.important,
    published: true,
  };
}

/** Public-safe: never throws — a query failure degrades to an empty list. */
export async function getPublishedNotices(): Promise<NoticeItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("status", "published")
      .order("notice_date", { ascending: false });

    if (error) {
      console.error("Failed to load published notices:", error.message);
      return [];
    }
    const rows = data ?? [];
    const attachmentUrls = await signNoticeAttachmentUrls(rows.map((row) => row.attachment_path));
    return rows.map((row, index) => toNoticeItem(row, attachmentUrls[index]));
  } catch (err) {
    console.error("Notices query failed:", err);
    return [];
  }
}
