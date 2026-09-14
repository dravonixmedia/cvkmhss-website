import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { legacyTimeline, positioningPillars, site } from "@/data/site";
import { faqCategories } from "@/data/faq";

const schoolFaq = faqCategories.filter((category) => category.id === "school");

const title = "About CVKM HSS";
const description =
  "Learn about C V K M Higher Secondary School's history, identity and journey since 1926 in East Kallada, Kollam, Kerala.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/about" });

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]} />
      <PageHero
        eyebrow="About CVKM"
        title="A Century-Rooted Institution in East Kallada"
        description={`${site.name} has served the East Kallada community since ${site.foundingYear}, growing into a full Higher Secondary institution since ${site.higherSecondaryStartYear}.`}
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Introduction" title="Who We Are" />
          <p className="mt-6 text-base leading-relaxed text-slate">
            {site.name} ({site.alternateName}) is an educational institution located in{" "}
            {site.address.locality}, {site.address.region}, {site.address.state}, {site.address.country}.
            Founded in {site.foundingYear}, the school has grown over the decades to offer Higher
            Secondary education since {site.higherSecondaryStartYear}, across Science, Computer
            Science and Humanities streams.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {positioningPillars.map((pillar) => (
              <div key={pillar.name} className="border-l-2 border-gold pl-5">
                <h3 className="font-heading text-base font-semibold text-navy">{pillar.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Legacy" title="Our Journey" />
          <ol className="mt-10 space-y-8 border-l border-border pl-6">
            {legacyTimeline.map((entry) => (
              <li key={entry.year} className="relative">
                <span
                  className="absolute top-1 -left-[29px] h-3 w-3 rounded-full bg-gold"
                  aria-hidden
                />
                <div className="font-heading text-xl font-bold text-navy">{entry.year}</div>
                <div className="mt-1 text-sm font-semibold text-charcoal">{entry.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate">{entry.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl space-y-12">
          <div>
            <SectionHeading eyebrow="Vision" title="Our Vision" />
            <div className="mt-6">
              <EmptyState
                title="Official vision statement pending"
                description="The school's official vision statement will be published here once confirmed by the management."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Mission" title="Our Mission" />
            <div className="mt-6">
              <EmptyState
                title="Official mission statement pending"
                description="The school's official mission statement will be published here once confirmed by the management."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Values" title="What We Stand For" />
            <div className="mt-6">
              <EmptyState
                title="Core values pending confirmation"
                description="The school's core institutional values will be published here once confirmed."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Leadership" title="School Leadership" />
            <div className="mt-6">
              <EmptyState
                title="Leadership details pending"
                description="Names and details of the school's management and leadership will be published here once confirmed."
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Frequently Asked Questions" title="About CVKM FAQ" />
          <div className="mt-10">
            <Faq categories={schoolFaq} />
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/about" })} />
    </>
  );
}
