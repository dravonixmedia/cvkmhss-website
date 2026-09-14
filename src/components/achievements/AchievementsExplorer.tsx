"use client";

import { useState } from "react";
import type { AchievementCategory, AchievementItem } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { staggerDelay } from "@/lib/stagger";

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
          <ul className="divide-y divide-border border-t border-border">
            {filtered.map((item, index) => (
              <Reveal
                key={item.slug}
                as="li"
                variant="fadeUp"
                delay={staggerDelay(index, 90)}
                className="grid gap-2 py-8 sm:grid-cols-[4rem_6rem_1fr] sm:gap-6"
              >
                <span className="font-heading text-xl font-bold text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-xs tracking-[0.14em] text-slate uppercase">{item.date}</span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
