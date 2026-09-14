import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="relative flex min-h-[82vh] items-end overflow-hidden sm:min-h-[78vh] lg:min-h-[92vh]">
      <PhotoPlaceholder
        caption={`${site.name} campus, East Kallada`}
        tone="navy"
        focal="top-right"
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/45 to-navy-dark/10" />

      <Container className="relative w-full pt-28 pb-14 text-white sm:pb-16 lg:pb-20">
        <p className="font-heading text-sm font-semibold tracking-[0.5em] text-gold-light sm:text-base">
          C V K M
          <span className="mx-2 text-white/40">·</span>
          HIGHER SECONDARY SCHOOL
        </p>

        <h1 className="font-heading mt-6 max-w-4xl text-[2.6rem] leading-[1.04] font-bold sm:text-6xl lg:text-7xl">
          A Century of Learning.
          <br />
          A Future Still Being Written.
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
          Serving generations of learners from East Kallada since {site.foundingYear}.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-xs tracking-[0.2em] text-white/60 uppercase sm:text-sm">
          <span className="text-gold-light">EST. {site.foundingYear}</span>
          <span>{site.address.locality}, {site.address.region}</span>
        </div>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button href="/about" variant="ghost">
            Explore the School
          </Button>
          <Button href="/admissions" variant="gold">
            Admissions
          </Button>
        </div>
      </Container>
    </section>
  );
}
