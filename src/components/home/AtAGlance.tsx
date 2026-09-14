import { Container } from "@/components/ui/Container";
import { Stat } from "@/components/ui/Stat";
import { glanceFacts } from "@/data/site";

export function AtAGlance() {
  return (
    <section className="border-y border-border bg-paper py-16">
      <Container>
        <h2 className="font-heading text-sm font-semibold tracking-[0.2em] text-gold uppercase">
          School at a Glance
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {glanceFacts.map((fact) => (
            <Stat key={fact.label} {...fact} />
          ))}
        </div>
      </Container>
    </section>
  );
}
