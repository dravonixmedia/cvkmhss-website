import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signDownloadDocumentUrls } from "@/lib/downloads/storage";
import { formatDisplayDate } from "@/lib/date";
import type { DownloadRow } from "@/lib/supabase/database.types";
import type { DownloadItem } from "@/types";

function toDownloadItem(row: DownloadRow, fileUrl: string | null): DownloadItem {
  return {
    title: row.title,
    category: row.category,
    fileUrl: fileUrl ?? "",
    updatedDate: formatDisplayDate(row.updated_at),
    description: row.description ?? undefined,
  };
}

/** Public-safe: never throws — a query failure degrades to an empty list. */
export async function getPublishedDownloads(): Promise<DownloadItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("downloads")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load published downloads:", error.message);
      return [];
    }
    const rows = data ?? [];
    const fileUrls = await signDownloadDocumentUrls(rows.map((row) => row.file_path));
    // A download whose signed URL could not be generated (e.g. the
    // Storage object is missing) is excluded rather than shown as a
    // broken/empty link.
    return rows
      .map((row, index) => toDownloadItem(row, fileUrls[index]))
      .filter((item) => item.fileUrl !== "");
  } catch (err) {
    console.error("Downloads query failed:", err);
    return [];
  }
}
