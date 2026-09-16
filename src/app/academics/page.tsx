import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { academicStages } from "@/data/academics";
import { faqCategories } from "@/data/faq";
import { pageHeroes } from "@/data/pageHeroes";
import { staggerDelay } from "@/lib/stagger";
import { getSiteImage } from "@/lib/site-images/public";

const title = "Academics";
const description =
  "Academic programmes at C V K M Higher Secondary School: Classes V–X and Higher Secondary streams in Science, Computer Science and Humanities.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/academics" });

const academicsFaq = faqCategories.filter((category) => category.id === "academics");

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Academics", href: "/academics" },
];

export default async function AcademicsPage() {
  const higherSecondary = academicStages.find((stage) => stage.id === "higher-secondary");
  const foundational = academicStages.find((stage) => stage.id === "classes-v-x");
  const heroImage = await getSiteImage("academics_hero");

  return (
    <>
      <LandingHero
        hero={pageHeroes.academics}
        breadcrumb={breadcrumb}
        imageUrl={heroImage?.url}
        imageAlt={heroImage?.alt}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Foundational & Secondary" title={foundational?.name ?? ""} />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
              {foundational?.description}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-border bg-paper py-16 sm:py-20">
        <Container>
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Higher Secondary" title={higherSecondary?.name ?? ""} />
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
              {higherSecondary?.description}
            </p>
          </Reveal>

          <div className="mt-10 grid divide-y divide-border border-t border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {higherSecondary?.streams?.map((stream, index) => (
              <Reveal
                key={stream.name}
                variant="fadeUp"
                delay={100 + staggerDelay(index, 90)}
                className="py-6 lg:px-8 lg:py-0 lg:first:pl-0"
              >
                <h3 className="font-heading text-lg font-semibold text-navy">{stream.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate">
                  {stream.subjects.map((subject) => (
                    <li key={subject.name} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden />
                      {subject.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Curriculum" title="Curriculum & Departments" />
            <div className="mt-6">
              <EmptyState
                title="Curriculum details coming soon"
                description="Detailed subject curriculum and department information will be published here."
              />
            </div>
          </Reveal>
          <Reveal variant="fadeUp" delay={80}>
            <SectionHeading eyebrow="Calendar" title="Academic Calendar & Examinations" />
            <div className="mt-6">
              <EmptyState
                title="Academic calendar coming soon"
                description="The academic calendar and examination schedule will be published here once confirmed."
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Frequently Asked Questions" title="Academics FAQ" />
            <div className="mt-10">
              <Faq categories={academicsFaq} />
            </div>
          </Reveal>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/academics" })} />
    </>
  );
}
