import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { facilities } from "@/data/campus";
import { glanceFacts } from "@/data/site";
import { faqCategories } from "@/data/faq";
import { pageHeroes } from "@/data/pageHeroes";
import { staggerDelay } from "@/lib/stagger";

const title = "Campus & Facilities";
const description =
  "Explore the CVKM HSS campus: Smart Classrooms, Library, Science and Computer Laboratories, Auditorium, Playground and School Transportation.";

const facilitiesFaq = faqCategories.filter((category) => category.id === "facilities");

export const metadata: Metadata = buildMetadata({ title, description, path: "/campus" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Campus", href: "/campus" },
];

export default function CampusPage() {
  return (
    <>
      <LandingHero hero={pageHeroes.campus} breadcrumb={breadcrumb} />

      <section className="border-b border-border bg-paper py-10">
        <Container>
          <div className="flex flex-wrap gap-10">
            {glanceFacts
              .filter((fact) => fact.label.includes("Campus") || fact.label.includes("Classrooms") || fact.label.includes("Library"))
              .map((fact, index) => (
                <Reveal key={fact.label} variant="fadeUp" delay={staggerDelay(index, 80)}>
                  <div className="font-heading text-2xl font-bold text-navy">{fact.value}</div>
                  <div className="text-xs text-slate">{fact.label}</div>
                </Reveal>
              ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Facilities" title="Campus Life" />
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => (
              <div key={facility.name}>
                <div className="relative aspect-[4/3]">
                  <PhotoPlaceholder
                    caption={facility.name}
                    tone={index % 2 === 0 ? "navy" : "ivory"}
                    focal={index % 3 === 0 ? "center" : index % 3 === 1 ? "top-left" : "bottom-right"}
                    compact
                    delay={staggerDelay(index, 80)}
                    className="absolute inset-0"
                  />
                </div>
                <Reveal variant="fadeUp" delay={staggerDelay(index, 80) + 200}>
                  <h3 className="font-heading mt-4 text-base font-semibold text-navy">
                    {facility.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{facility.description}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Frequently Asked Questions" title="Campus FAQ" />
            <div className="mt-10">
              <Faq categories={facilitiesFaq} />
            </div>
          </Reveal>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/campus" })} />
    </>
  );
}
