import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { achievementCategories } from "@/data/achievements";
import { getPublishedAchievements } from "@/lib/achievements/public";
import { staggerDelay } from "@/lib/stagger";

export async function Achievements() {
  const achievements = await getPublishedAchievements();

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal variant="fadeUp">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Achievements" title="Celebrating Progress" />
            <Link
              href="/achievements"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
            >
              View all achievements <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-5">
          {achievementCategories
            .filter((category) => category.id !== "all")
            .map((category, index) => (
              <Reveal
                key={category.id}
                as="li"
                variant="fadeUp"
                delay={staggerDelay(index, 50)}
                className="flex items-baseline gap-2 text-xs tracking-[0.14em] uppercase"
              >
                <span className="text-gold">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-slate">{category.label}</span>
              </Reveal>
            ))}
        </ul>

        <div className="mt-10">
          {achievements.length === 0 ? (
            <Reveal variant="fadeUp" delay={120}>
              <EmptyState
                title="Achievements coming soon"
                description="Verified student and school achievements will be published here as they are confirmed."
              />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
