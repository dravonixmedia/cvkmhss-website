import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";
import { getSiteImage } from "@/lib/site-images/public";

export async function Hero() {
  const heroImage = await getSiteImage("home_hero");
  const caption = `${site.name} campus, East Kallada`;

  return (
    <section className="relative flex min-h-[82vh] items-end overflow-hidden sm:min-h-[78vh] lg:min-h-[92vh]">
      {heroImage ? (
        <Image
          src={heroImage.url}
          alt={heroImage.alt || caption}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      ) : (
        <PhotoPlaceholder caption={caption} tone="navy" focal="top-right" className="absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/45 to-navy-dark/10" />

      <Container className="relative w-full pt-28 pb-14 text-white sm:pb-16 lg:pb-20">
        <Reveal variant="fadeUp">
          <p className="font-heading text-sm font-semibold tracking-[0.5em] text-gold-light sm:text-base">
            C V K M
            <span className="mx-2 text-white/40">·</span>
            HIGHER SECONDARY SCHOOL
          </p>
        </Reveal>

        <h1 className="font-heading mt-6 max-w-4xl text-[2.6rem] leading-[1.04] font-bold sm:text-6xl lg:text-7xl">
          <Reveal as="span" variant="fadeUp" delay={90} className="block">
            A Century of Learning.
          </Reveal>
          <Reveal as="span" variant="fadeUp" delay={170} className="block">
            A Future Still Being Written.
          </Reveal>
        </h1>

        <Reveal variant="fadeUp" delay={280}>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            Serving generations of learners from East Kallada since {site.foundingYear}.
          </p>
        </Reveal>

        <Reveal variant="fadeUp" delay={360}>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-xs tracking-[0.2em] text-white/60 uppercase sm:text-sm">
            <span className="text-gold-light">EST. {site.foundingYear}</span>
            <span>{site.address.locality}, {site.address.region}</span>
          </div>
        </Reveal>

        <Reveal variant="fadeUp" delay={440}>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="/about" variant="ghost">
              Explore the School
            </Button>
            <Button href="/admissions" variant="gold">
              Admissions
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
