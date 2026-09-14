import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { studentActivities } from "@/data/student-life";

const title = "Student Life";
const description =
  "Student life at CVKM HSS: NCC, NSS, Scouts & Guides, Little KITES, Sports, Arts & Culture, Clubs and Student Projects.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/student-life" });

export default function StudentLifePage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Student Life", href: "/student-life" }]}
      />
      <PageHero
        eyebrow="Student Life"
        title="Beyond the Classroom"
        description="Activities and programmes that build character, skills and community at CVKM."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Activities" title="Programmes at CVKM" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {studentActivities.map((activity) => (
              <div key={activity.name} className="border-t-2 border-gold pt-5">
                <h3 className="font-heading text-base font-semibold text-navy">{activity.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{activity.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/student-life" })} />
    </>
  );
}
