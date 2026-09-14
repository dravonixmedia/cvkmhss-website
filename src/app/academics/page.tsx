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
import { academicStages } from "@/data/academics";
import { faqCategories } from "@/data/faq";

const title = "Academics";
const description =
  "Academic programmes at C V K M Higher Secondary School: Classes V–X and Higher Secondary streams in Science, Computer Science and Humanities.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/academics" });

const academicsFaq = faqCategories.filter((category) => category.id === "academics");

export default function AcademicsPage() {
  const higherSecondary = academicStages.find((stage) => stage.id === "higher-secondary");
  const foundational = academicStages.find((stage) => stage.id === "classes-v-x");

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Academics", href: "/academics" }]}
      />
      <PageHero
        eyebrow="Academics"
        title="Learning for Every Stage"
        description="Structured academic pathways from Class V through Higher Secondary."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Foundational & Secondary" title={foundational?.name ?? ""} />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            {foundational?.description}
          </p>
        </Container>
      </section>

      <section className="border-y border-border bg-paper py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Higher Secondary" title={higherSecondary?.name ?? ""} />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            {higherSecondary?.description}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {higherSecondary?.streams?.map((stream) => (
              <div key={stream.name} className="border border-border bg-off-white p-6">
                <h3 className="font-heading text-lg font-semibold text-navy">{stream.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate">
                  {stream.subjects.map((subject) => (
                    <li key={subject.name} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                      {subject.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Curriculum" title="Curriculum & Departments" />
            <div className="mt-6">
              <EmptyState
                title="Curriculum details coming soon"
                description="Detailed subject curriculum and department information will be published here."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Calendar" title="Academic Calendar & Examinations" />
            <div className="mt-6">
              <EmptyState
                title="Academic calendar coming soon"
                description="The academic calendar and examination schedule will be published here once confirmed."
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Frequently Asked Questions" title="Academics FAQ" />
          <div className="mt-10">
            <Faq categories={academicsFaq} />
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/academics" })} />
    </>
  );
}
