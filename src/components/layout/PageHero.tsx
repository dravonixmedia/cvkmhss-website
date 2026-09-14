import type { BreadcrumbItem } from "@/types";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Lightweight navy hero (no photography slot) for secondary pages that sit
 * outside the primary navigation — e.g. Notices, Downloads. Primary landing
 * pages use the full LandingHero image system instead.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumb: BreadcrumbItem[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full border border-gold/20"
      />
      <Container className="relative py-14 sm:py-20">
        <Reveal variant="fadeIn">
          <Breadcrumbs items={breadcrumb} tone="light" embedded />
        </Reveal>
        <Reveal variant="fadeUp" delay={60} className="mt-6">
          <p className="text-xs font-semibold tracking-[0.28em] text-gold-light uppercase">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={140}>
          <h1 className="font-heading mt-4 max-w-2xl text-3xl leading-[1.08] font-bold sm:text-4xl lg:text-5xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal variant="fadeUp" delay={220}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
