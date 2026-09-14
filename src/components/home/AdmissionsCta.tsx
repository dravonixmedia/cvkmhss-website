import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function AdmissionsCta() {
  return (
    <section className="bg-navy py-20 text-white sm:py-24">
      <Container className="text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">Admissions</p>
        <h2 className="font-heading mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
          Begin Your Journey With CVKM
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/admissions" variant="gold">
            Explore Admissions
          </Button>
          <Button href="/contact" variant="ghost">
            Contact School
          </Button>
        </div>
      </Container>
    </section>
  );
}
