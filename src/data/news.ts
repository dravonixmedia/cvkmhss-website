import type { NewsArticle } from "@/types";

/**
 * No verified news articles have been supplied yet. Do not add fabricated
 * entries — the News UI renders a clear empty state until real content is
 * published (Phase 2: via the admin dashboard / Supabase).
 */
export const newsArticles: NewsArticle[] = [];

export function getNewsBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getRelatedNews(slug: string, limit = 3): NewsArticle[] {
  return newsArticles.filter((article) => article.slug !== slug).slice(0, limit);
}
