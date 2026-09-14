import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { achievementCategories, achievements } from "@/data/achievements";

export function Achievements() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Achievements" title="Celebrating Progress" />
          <Link
            href="/achievements"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            View all achievements <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {achievementCategories
            .filter((category) => category.id !== "all")
            .map((category) => (
              <span
                key={category.id}
                className="border border-border px-4 py-1.5 text-xs font-medium tracking-wide text-slate uppercase"
              >
                {category.label}
              </span>
            ))}
        </div>

        <div className="mt-8">
          {achievements.length === 0 ? (
            <EmptyState
              title="Achievements coming soon"
              description="Verified student and school achievements will be published here as they are confirmed."
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}
