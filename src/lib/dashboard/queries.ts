import "server-only";

import { createClient } from "@/lib/supabase/server";

const DOMAINS = [
  {
    table: "management_members",
    label: "Management & Leadership",
    href: "/admin/management",
    addHref: "/admin/management/new",
    addLabel: "Add Management Member",
    titleColumn: "full_name",
  },
  {
    table: "news",
    label: "News",
    href: "/admin/news",
    addHref: "/admin/news/new",
    addLabel: "Add News",
    titleColumn: "title",
  },
  {
    table: "events",
    label: "Events",
    href: "/admin/events",
    addHref: "/admin/events/new",
    addLabel: "Add Event",
    titleColumn: "title",
  },
  {
    table: "achievements",
    label: "Achievements",
    href: "/admin/achievements",
    addHref: "/admin/achievements/new",
    addLabel: "Add Achievement",
    titleColumn: "title",
  },
  {
    table: "notices",
    label: "Notices",
    href: "/admin/notices",
    addHref: "/admin/notices/new",
    addLabel: "Add Notice",
    titleColumn: "title",
  },
  {
    table: "downloads",
    label: "Downloads",
    href: "/admin/downloads",
    addHref: "/admin/downloads/new",
    addLabel: "Add Download",
    titleColumn: "title",
  },
  {
    table: "gallery_albums",
    label: "Gallery Albums",
    href: "/admin/gallery",
    addHref: "/admin/gallery/new",
    addLabel: "Create Gallery Album",
    titleColumn: "title",
  },
] as const;

export interface ContentOverviewItem {
  label: string;
  href: string;
  addHref: string;
  addLabel: string;
  published: number;
  draft: number;
}

/** Counts only — no row content — so this is safe even for an editor's dashboard view. */
export async function getContentOverview(): Promise<ContentOverviewItem[]> {
  const supabase = await createClient();

  return Promise.all(
    DOMAINS.map(async (domain) => {
      const [{ count: published }, { count: draft }] = await Promise.all([
        supabase.from(domain.table).select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from(domain.table).select("id", { count: "exact", head: true }).eq("status", "draft"),
      ]);

      return {
        label: domain.label,
        href: domain.href,
        addHref: domain.addHref,
        addLabel: domain.addLabel,
        published: published ?? 0,
        draft: draft ?? 0,
      };
    })
  );
}

export interface RecentContentItem {
  id: string;
  title: string;
  domainLabel: string;
  status: "draft" | "published";
  updatedAt: string;
  editHref: string;
}

/**
 * Most recently updated content across all seven domains, using the
 * `updated_at` audit column every content table already has — no
 * separate audit-log table exists or is needed for this.
 */
export async function getRecentContent(limit = 6): Promise<RecentContentItem[]> {
  const supabase = await createClient();

  const perDomain = await Promise.all(
    DOMAINS.map(async (domain) => {
      const { data } = await supabase
        .from(domain.table)
        .select(`id, status, updated_at, ${domain.titleColumn}`)
        .order("updated_at", { ascending: false })
        .limit(limit);

      return (data ?? []).map((row) => {
        const record = row as unknown as Record<string, string>;
        return {
          id: record.id,
          title: record[domain.titleColumn] || "(untitled)",
          domainLabel: domain.label,
          status: record.status as "draft" | "published",
          updatedAt: record.updated_at,
          editHref: `${domain.href}/${record.id}/edit`,
        };
      });
    })
  );

  return perDomain
    .flat()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}
