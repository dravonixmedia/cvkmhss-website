import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import { glanceFacts } from "@/data/site";

export function AtAGlance() {
  return (
    <section className="border-b border-border bg-paper py-16 sm:py-20">
      <Container>
        <h2 className="font-heading text-xs font-semibold tracking-[0.28em] text-gold uppercase">
          School at a Glance
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          {glanceFacts.map((fact) => (
            <Stat key={fact.label} {...fact} />
          ))}
        </div>
      </Container>
    </section>
  );
}
