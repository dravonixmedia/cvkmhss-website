"use client";

import { useMemo, useState } from "react";
import type { NoticeCategory, NoticeItem } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";

const categoryLabels: Record<NoticeCategory, string> = {
  academic: "Academic",
  admissions: "Admissions",
  examination: "Examination",
  general: "General",
  event: "Event",
};

export function NoticesExplorer({ notices }: { notices: NoticeItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NoticeCategory | "all">("all");

  const filtered = useMemo(() => {
    return notices.filter((notice) => {
      const matchesCategory = category === "all" || notice.category === category;
      const matchesQuery = notice.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [notices, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="sr-only" htmlFor="notice-search">
          Search notices
        </label>
        <input
          id="notice-search"
          type="search"
          placeholder="Search notices…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full max-w-sm border border-border bg-paper px-4 py-2 text-sm text-charcoal focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`border px-3 py-1.5 text-xs font-medium uppercase ${
              category === "all" ? "border-navy bg-navy text-white" : "border-border text-slate"
            }`}
          >
            All
          </button>
          {(Object.keys(categoryLabels) as NoticeCategory[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`border px-3 py-1.5 text-xs font-medium uppercase ${
                category === key ? "border-navy bg-navy text-white" : "border-border text-slate"
              }`}
            >
              {categoryLabels[key]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <EmptyState
            title="No notices found"
            description="No published notices match this search or category yet."
          />
        ) : (
          <div className="border-y border-border">
            <div className="hidden grid-cols-[6rem_9rem_1fr_6rem] gap-4 border-b border-border py-3 text-xs font-semibold tracking-[0.14em] text-slate uppercase sm:grid">
              <span>Date</span>
              <span>Category</span>
              <span>Notice</span>
              <span>Action</span>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((notice) => (
                <li
                  key={notice.slug}
                  className="grid grid-cols-1 gap-1.5 py-5 sm:grid-cols-[6rem_9rem_1fr_6rem] sm:items-start sm:gap-4"
                >
                  <span className="text-xs font-medium text-gold sm:text-sm">{notice.date}</span>
                  <span className="text-xs tracking-wide text-slate uppercase">
                    {categoryLabels[notice.category]}
                  </span>
                  <div>
                    <span className="font-medium text-charcoal">{notice.title}</span>
                    {notice.important && (
                      <span className="ml-2 border border-gold px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gold uppercase">
                        Important
                      </span>
                    )}
                    <p className="mt-1 text-sm text-slate">{notice.description}</p>
                  </div>
                  {notice.attachmentUrl ? (
                    <a href={notice.attachmentUrl} className="text-xs font-medium text-navy hover:underline">
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-border">—</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
