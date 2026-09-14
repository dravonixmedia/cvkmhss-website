import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import { Reveal } from "@/components/motion/Reveal";
import { glanceFacts } from "@/data/site";
import { staggerDelay } from "@/lib/stagger";

export function AtAGlance() {
  return (
    <section className="border-b border-border bg-paper py-16 sm:py-20">
      <Container>
        <Reveal variant="fadeIn">
          <h2 className="font-heading text-xs font-semibold tracking-[0.28em] text-gold uppercase">
            School at a Glance
          </h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {glanceFacts.map((fact, index) => (
            <Reveal key={fact.label} variant="fadeUp" delay={staggerDelay(index, 90)}>
              <Stat {...fact} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
