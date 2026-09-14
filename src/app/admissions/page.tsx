import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { academicStages } from "@/data/academics";
import { faqCategories } from "@/data/faq";
import { pageHeroes } from "@/data/pageHeroes";

const title = "Admissions";
const description =
  "Admissions overview for C V K M Higher Secondary School: available classes and Higher Secondary streams in Science, Computer Science and Humanities.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/admissions" });

const admissionsFaq = faqCategories.filter((category) => category.id === "admissions");

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Admissions", href: "/admissions" },
];

export default function AdmissionsPage() {
  const higherSecondary = academicStages.find((stage) => stage.id === "higher-secondary");

  return (
    <>
      <LandingHero hero={pageHeroes.admissions} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Overview" title="Available Classes & Programmes" />
          <div className="mt-10 grid divide-y divide-border border-t border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="py-6 sm:py-0 sm:pr-8">
              <h3 className="font-heading text-base font-semibold text-navy">Classes V–X</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Secondary schooling building core academic foundations.
              </p>
            </div>
            <div className="py-6 sm:py-0 sm:pl-8">
              <h3 className="font-heading text-base font-semibold text-navy">Higher Secondary</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate">
                {higherSecondary?.streams?.map((stream) => <li key={stream.name}>{stream.name}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-paper py-16 sm:py-20">
        <Container className="grid gap-8 sm:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Guidelines" title="Admission Guidelines" />
            <div className="mt-6">
              <EmptyState
                title="Guidelines coming soon"
                description="Detailed admission guidelines will be published here once confirmed by the school."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Dates" title="Important Dates" />
            <div className="mt-6">
              <EmptyState
                title="Admission is not currently open"
                description="Important dates will be published here once the admission process is announced."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Documents" title="Required Documents" />
            <div className="mt-6">
              <EmptyState
                title="Document list coming soon"
                description="A list of required documents will be published here once confirmed."
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Enquiry" title="Admission Enquiry" />
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-relaxed text-slate">
                For admission enquiries, please contact the school office directly.
              </p>
              <Button href="/contact" variant="secondary">
                Contact School
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Frequently Asked Questions" title="Admissions FAQ" />
          <div className="mt-10">
            <Faq categories={admissionsFaq} />
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/admissions" })} />
    </>
  );
}
