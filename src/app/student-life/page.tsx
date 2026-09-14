import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { studentActivities } from "@/data/student-life";
import { pageHeroes } from "@/data/pageHeroes";
import { staggerDelay } from "@/lib/stagger";

const title = "Student Life";
const description =
  "Student life at CVKM HSS: NCC, NSS, Scouts & Guides, Little KITES, Sports, Arts & Culture, Clubs and Student Projects.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/student-life" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Student Life", href: "/student-life" },
];

export default function StudentLifePage() {
  return (
    <>
      <LandingHero hero={pageHeroes["student-life"]} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container>
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="Activities" title="Programmes at CVKM" />
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {studentActivities.map((activity, index) => (
              <Reveal
                key={activity.name}
                variant="fadeUp"
                delay={staggerDelay(index, 70)}
                className="border-t-2 border-gold pt-5"
              >
                <h3 className="font-heading text-base font-semibold text-navy">{activity.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{activity.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container>
          <Reveal variant="fadeUp">
            <SectionHeading eyebrow="In Action" title="Life Beyond the Timetable" />
          </Reveal>
          <div className="mt-10 grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[11rem] sm:grid-cols-4">
            {["Sports", "Arts & Culture", "NCC & NSS", "Clubs & Projects"].map((label, index) => (
              <div
                key={label}
                className={`relative ${index === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <PhotoPlaceholder
                  caption={label}
                  tone={index % 2 === 0 ? "navy" : "ivory"}
                  focal={index % 3 === 0 ? "bottom-left" : "top-right"}
                  compact={index !== 0}
                  delay={staggerDelay(index, 80)}
                  className="absolute inset-0"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/student-life" })} />
    </>
  );
}
