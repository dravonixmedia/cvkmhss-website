"use client";

import { useState } from "react";
import type { AchievementCategory, AchievementItem } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";

interface Props {
  categories: { id: AchievementCategory | "all"; label: string }[];
  items: AchievementItem[];
}

export function AchievementsExplorer({ categories, items }: Props) {
  const [active, setActive] = useState<AchievementCategory | "all">("all");
  const filtered = active === "all" ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter achievements by category">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={active === category.id}
            onClick={() => setActive(category.id)}
            className={`border px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-colors ${
              active === category.id
                ? "border-navy bg-navy text-white"
                : "border-border text-slate hover:border-navy hover:text-navy"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState
            title="No achievements in this category yet"
            description="Verified achievements will be published here as they are confirmed by the school."
          />
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <li key={item.slug} className="border border-border bg-paper p-6">
                <p className="text-xs font-semibold tracking-wide text-gold uppercase">
                  {item.date}
                </p>
                <h3 className="font-heading mt-2 text-base font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
