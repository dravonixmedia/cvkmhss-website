import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPublishedNewsArticles } from "@/lib/news/public";

const staticRoutes = [
  "",
  "/about",
  "/academics",
  "/campus",
  "/student-life",
  "/achievements",
  "/admissions",
  "/news",
  "/events",
  "/gallery",
  "/notices",
  "/downloads",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const newsArticles = await getPublishedNewsArticles();
  const newsEntries: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: new URL(`/news/${article.slug}`, site.url).toString(),
    lastModified: new Date(article.updatedDate ?? article.publishedDate),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...newsEntries];
}
