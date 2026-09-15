import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signNewsImageUrl, signNewsImageUrls } from "@/lib/news/storage";
import { formatDisplayDate } from "@/lib/date";
import type { NewsRow } from "@/lib/supabase/database.types";
import type { NewsArticle } from "@/types";

/**
 * Adapts live, published Supabase rows into the exact NewsArticle shape
 * the existing public pages/components already expect (src/types), so
 * those pages need only swap their data source, not their JSX.
 */
async function toNewsArticle(row: NewsRow, imageUrl: string | null): Promise<NewsArticle> {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    body: row.body,
    publishedDate: formatDisplayDate(row.published_at ?? row.created_at),
    updatedDate:
      row.updated_at && row.published_at && row.updated_at !== row.published_at
        ? formatDisplayDate(row.updated_at)
        : undefined,
    featuredImage: imageUrl ?? undefined,
    author: row.author ?? undefined,
  };
}

/** Public-safe: never throws — a query failure degrades to an empty list. */
export async function getPublishedNewsArticles(): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Failed to load published news:", error.message);
      return [];
    }
    const rows = data ?? [];
    const imageUrls = await signNewsImageUrls(rows.map((row) => row.featured_image));
    return Promise.all(rows.map((row, index) => toNewsArticle(row, imageUrls[index])));
  } catch (err) {
    console.error("News query failed:", err);
    return [];
  }
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return null;
    const imageUrl = await signNewsImageUrl(data.featured_image);
    return toNewsArticle(data, imageUrl);
  } catch (err) {
    console.error("News article query failed:", err);
    return null;
  }
}

export async function getRelatedNewsArticles(slug: string, limit = 3): Promise<NewsArticle[]> {
  const all = await getPublishedNewsArticles();
  return all.filter((article) => article.slug !== slug).slice(0, limit);
}
