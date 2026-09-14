import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { legacyTimeline, site } from "@/data/site";
import { staggerDelay } from "@/lib/stagger";

export function Timeline() {
  return (
    <section className="bg-navy py-20 text-white sm:py-28">
      <Container>
        <Reveal variant="fadeUp">
          <SectionHeading
            eyebrow="Our Journey"
            title={`A Journey Since ${site.foundingYear}`}
            tone="light"
          />
        </Reveal>

        {/* Mobile: vertical continuous line */}
        <ol className="relative mt-14 space-y-10 sm:hidden">
          <Reveal
            as="div"
            variant="lineReveal"
            vertical
            aria-hidden
            className="absolute top-1.5 bottom-1.5 left-[3px] w-px bg-white/15"
          />
          {legacyTimeline.map((entry, index) => (
            <Reveal key={entry.year} as="li" variant="fadeUp" delay={150 + staggerDelay(index, 110)} className="relative pl-8">
              <span aria-hidden className="absolute top-1.5 left-0 h-[7px] w-[7px] bg-gold" />
              <div className="font-heading text-xl font-bold text-gold">{entry.year}</div>
              <div className="mt-1.5 text-sm font-semibold text-white">{entry.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/65">{entry.description}</p>
            </Reveal>
          ))}
        </ol>

        {/* Desktop/tablet: continuous horizontal line */}
        <ol className="relative mt-20 hidden sm:grid sm:grid-cols-4 sm:gap-10">
          <Reveal
            as="div"
            variant="lineReveal"
            aria-hidden
            className="absolute top-[5px] right-0 left-0 h-px bg-white/15"
          />
          {legacyTimeline.map((entry, index) => (
            <Reveal key={entry.year} as="li" variant="fadeUp" delay={150 + staggerDelay(index, 130)} className="relative pt-8">
              <span aria-hidden className="absolute top-0 left-0 h-[11px] w-[11px] bg-gold" />
              <div className="font-heading text-2xl font-bold text-gold">{entry.year}</div>
              <div className="mt-2 text-sm font-semibold text-white">{entry.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{entry.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
