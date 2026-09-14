import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { positioningPillars, site } from "@/data/site";

export function Introduction() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <SectionHeading
            eyebrow="Welcome to CVKM"
            title="A Century of Learning, Growth and Community"
            description={`${site.name} has served students from ${site.address.locality} and the surrounding community since ${site.foundingYear}, growing from its early years into a Higher Secondary institution offering Science, Computer Science and Humanities since ${site.higherSecondaryStartYear}.`}
          />

          <div
            aria-hidden
            className="hidden h-40 w-px bg-border lg:block"
          />

          <div>
            <div className="font-heading text-7xl font-bold text-navy sm:text-8xl">
              {site.foundingYear}
            </div>
            <p className="mt-2 text-sm tracking-wide text-slate uppercase">
              The year it all began
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {positioningPillars.map((pillar) => (
                <div key={pillar.name}>
                  <dt className="text-sm font-semibold text-navy">{pillar.name}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-slate">{pillar.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
