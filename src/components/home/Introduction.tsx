import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { positioningPillars, site } from "@/data/site";
import { staggerDelay } from "@/lib/stagger";

export function Introduction() {
  return (
    <section className="border-b border-border py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal variant="fadeUp" className="relative">
            <span className="font-heading block text-[6rem] leading-none font-bold text-navy sm:text-[8rem] lg:text-[9.5rem]">
              {site.foundingYear}
            </span>
            <p className="mt-3 text-xs font-semibold tracking-[0.3em] text-gold uppercase">
              The year it all began
            </p>
          </Reveal>

          <div className="lg:border-l lg:border-border lg:pl-16">
            <Reveal variant="fadeUp" delay={100}>
              <p className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">
                Welcome to CVKM
              </p>
              <h2 className="font-heading mt-4 max-w-xl text-3xl leading-[1.1] font-bold text-navy sm:text-4xl">
                A Century of Learning, Growth and Community
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate">
                {site.name} has served students from {site.address.locality} and the surrounding
                community since {site.foundingYear}, growing from its early years into a Higher
                Secondary institution offering Science, Computer Science and Humanities since{" "}
                {site.higherSecondaryStartYear}.
              </p>
            </Reveal>

            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8">
              {positioningPillars.map((pillar, index) => (
                <Reveal
                  key={pillar.name}
                  as="li"
                  variant="fadeUp"
                  delay={staggerDelay(index, 70)}
                  className="max-w-[11rem]"
                >
                  <p className="font-heading text-sm font-semibold text-navy">{pillar.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate">{pillar.description}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
