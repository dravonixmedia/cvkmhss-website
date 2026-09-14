import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { facilities } from "@/data/campus";
import { glanceFacts } from "@/data/site";
import { faqCategories } from "@/data/faq";

const title = "Campus & Facilities";
const description =
  "Explore the CVKM HSS campus: Smart Classrooms, Library, Science and Computer Laboratories, Auditorium, Playground and School Transportation.";

const facilitiesFaq = faqCategories.filter((category) => category.id === "facilities");

export const metadata: Metadata = buildMetadata({ title, description, path: "/campus" });

export default function CampusPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Campus", href: "/campus" }]} />
      <PageHero
        eyebrow="Campus"
        title="A Campus Built for Learning"
        description="A four-acre campus equipped to support academics, technology and student life."
      />

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
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <div key={facility.name} className="border border-border bg-paper p-6">
                <div className="aspect-video w-full border border-dashed border-border bg-off-white" aria-hidden />
                <h3 className="font-heading mt-4 text-base font-semibold text-navy">
                  {facility.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate">{facility.description}</p>
                <p className="mt-2 text-xs text-slate italic">Photography to be added.</p>
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
