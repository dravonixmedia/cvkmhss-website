import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { ManagementSection } from "@/components/about/ManagementSection";
import { webPageSchema, personSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { legacyTimeline, positioningPillars, site } from "@/data/site";
import { faqCategories } from "@/data/faq";
import { pageHeroes } from "@/data/pageHeroes";
import { staggerDelay } from "@/lib/stagger";
import { getPublishedManagementMembers } from "@/lib/management/queries";
import { signManagementPhotoUrls } from "@/lib/management/storage";
import { getSiteImage } from "@/lib/site-images/public";

const schoolFaq = faqCategories.filter((category) => category.id === "school");

const title = "About CVKM HSS";
const description =
  "Learn about C V K M Higher Secondary School's history, identity and journey since 1926 in East Kallada, Kollam, Kerala.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/about" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default async function AboutPage() {
  const managementMembers = await getPublishedManagementMembers();
  const photoUrls = await signManagementPhotoUrls(managementMembers.map((m) => m.photo_path));
  const managementDisplay = managementMembers.map((member, index) => ({
    member,
    photoUrl: photoUrls[index],
  }));
  const heroImage = await getSiteImage("about_hero");

  return (
    <>
      <LandingHero
        hero={pageHeroes.about}
        breadcrumb={breadcrumb}
        imageUrl={heroImage?.url}
        imageAlt={heroImage?.alt}
      />

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Introduction" title="Who We Are" />
            <p className="mt-6 text-base leading-relaxed text-slate">
              {site.name} ({site.alternateName}) is an educational institution located in{" "}
              {site.address.locality}, {site.address.region}, {site.address.state}, {site.address.country}.
              Founded in {site.foundingYear}, the school has grown over the decades to offer Higher
              Secondary education since {site.higherSecondaryStartYear}, across Science, Computer
              Science and Humanities streams.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {positioningPillars.map((pillar, index) => (
              <Reveal
                key={pillar.name}
                variant="fadeUp"
                delay={100 + staggerDelay(index, 70)}
                className="border-l-2 border-gold pl-5"
              >
                <h3 className="font-heading text-base font-semibold text-navy">{pillar.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate">{pillar.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Legacy" title="Our Journey" />
          </Reveal>
          <ol className="mt-10 space-y-8 border-l border-border pl-6">
            {legacyTimeline.map((entry, index) => (
              <Reveal key={entry.year} as="li" variant="fadeUp" delay={staggerDelay(index, 100)} className="relative">
                <span className="absolute top-1 -left-[29px] h-3 w-3 bg-gold" aria-hidden />
                <div className="font-heading text-xl font-bold text-navy">{entry.year}</div>
                <div className="mt-1 text-sm font-semibold text-charcoal">{entry.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate">{entry.description}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Identity" title="Vision, Mission & Values" />
          </Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-10 border-t border-border pt-10 sm:grid-cols-2">
            {[
              {
                title: "Official vision statement pending",
                description:
                  "The school's official vision statement will be published here once confirmed by the management.",
              },
              {
                title: "Official mission statement pending",
                description:
                  "The school's official mission statement will be published here once confirmed by the management.",
              },
              {
                title: "Core values pending confirmation",
                description: "The school's core institutional values will be published here once confirmed.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} variant="fadeUp" delay={staggerDelay(index, 70)}>
                <EmptyState title={item.title} description={item.description} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ManagementSection members={managementDisplay} />

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Frequently Asked Questions" title="About CVKM FAQ" />
            <div className="mt-10">
              <Faq categories={schoolFaq} />
            </div>
          </Reveal>
        </Container>
      </section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/about" }),
          ...managementMembers.map((member) => personSchema(member)),
        ]}
      />
    </>
  );
}
