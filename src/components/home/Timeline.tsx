import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { legacyTimeline, site } from "@/data/site";

export function Timeline() {
  return (
    <section className="bg-navy py-20 text-white sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Our Journey"
          title={`A Journey Since ${site.foundingYear}`}
          tone="light"
        />

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {legacyTimeline.map((entry) => (
            <li key={entry.year} className="border-t-2 border-gold pt-5">
              <div className="font-heading text-2xl font-bold text-gold">{entry.year}</div>
              <div className="mt-2 text-sm font-semibold text-white">{entry.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{entry.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
