import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { facilities } from "@/data/campus";
import { glanceFacts } from "@/data/site";
import { faqCategories } from "@/data/faq";
import { pageHeroes } from "@/data/pageHeroes";

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
              .map((fact) => (
                <div key={fact.label}>
                  <div className="font-heading text-2xl font-bold text-navy">{fact.value}</div>
                  <div className="text-xs text-slate">{fact.label}</div>
                </div>
              ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Facilities" title="Campus Life" />
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => (
              <div key={facility.name}>
                <div className="relative aspect-[4/3]">
                  <PhotoPlaceholder
                    caption={facility.name}
                    tone={index % 2 === 0 ? "navy" : "ivory"}
                    focal={index % 3 === 0 ? "center" : index % 3 === 1 ? "top-left" : "bottom-right"}
                    compact
                    className="absolute inset-0"
                  />
                </div>
                <h3 className="font-heading mt-4 text-base font-semibold text-navy">
                  {facility.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate">{facility.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Frequently Asked Questions" title="Campus FAQ" />
          <div className="mt-10">
            <Faq categories={facilitiesFaq} />
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/campus" })} />
    </>
  );
}
