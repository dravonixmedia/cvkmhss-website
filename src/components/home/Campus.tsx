import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { facilities } from "@/data/campus";
import { staggerDelay } from "@/lib/stagger";
import { getSiteImage } from "@/lib/site-images/public";

export async function Campus() {
  const highlightImage = await getSiteImage("home_campus_highlight");
  const caption = "CVKM campus, East Kallada";

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal variant="fadeUp">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Campus" title="A Campus Built for Learning" />
            <Link
              href="/campus"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
            >
              Explore the campus <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div className="relative h-72 sm:h-96 lg:h-[30rem]">
            {highlightImage ? (
              <Image
                src={highlightImage.url}
                alt={highlightImage.alt || caption}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <PhotoPlaceholder caption={caption} tone="navy" focal="bottom-left" className="absolute inset-0" />
            )}
          </div>

          <ul className="divide-y divide-border border-t border-border lg:self-center">
            {facilities.map((facility, index) => (
              <Reveal key={facility.name} as="li" variant="fadeUp" delay={staggerDelay(index, 70)} className="py-4">
                <h3 className="font-heading text-base font-semibold text-navy">{facility.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate">{facility.description}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
