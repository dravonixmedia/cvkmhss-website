import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function AdmissionsCta() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 text-white sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-10rem] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full border border-gold/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-6rem] h-[18rem] w-[18rem] -translate-y-1/2 rounded-full border border-gold/20"
      />

      <Container className="relative max-w-3xl">
        <Reveal variant="fadeUp">
          <p className="text-xs font-semibold tracking-[0.32em] text-gold uppercase">Admissions</p>
          <h2 className="font-heading mt-5 text-4xl leading-[1.05] font-bold uppercase sm:text-5xl lg:text-6xl">
            Begin Your Journey
            <br />
            With CVKM
          </h2>
        </Reveal>
        <Reveal variant="fadeUp" delay={100}>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Admission enquiries are welcome at any time — explore what CVKM offers, or reach the
            school office directly.
          </p>
        </Reveal>
        <Reveal variant="fadeUp" delay={180}>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/admissions" variant="gold">
              Explore Admissions
            </Button>
            <Button href="/contact" variant="ghost">
              Contact School
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
