import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[560px] w-[560px] rounded-full border border-gold/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full border border-gold/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 -left-32 h-[440px] w-[440px] rounded-full border border-white/10"
      />

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <p className="text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          {site.name}
        </p>
        <h1 className="font-heading mt-6 max-w-3xl text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
          A Legacy of Learning.
          <br />A Future of Possibilities.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
          Serving generations of learners from East Kallada since 1926.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-gold">EST. {site.foundingYear}</span>
          </span>
          <span className="h-8 w-px bg-white/20" aria-hidden />
          <span>{site.address.locality}, {site.address.region}</span>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/about" variant="ghost">
            Explore Our School
          </Button>
          <Button href="/admissions" variant="gold">
            Admissions
          </Button>
        </div>
      </Container>
    </section>
  );
}
