import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { AtAGlance } from "@/components/home/AtAGlance";
import { AcademicsSection } from "@/components/home/AcademicsSection";
import { Timeline } from "@/components/home/Timeline";
import { Campus } from "@/components/home/Campus";
import { StudentLife } from "@/components/home/StudentLife";
import { Achievements } from "@/components/home/Achievements";
import { NewsSection } from "@/components/home/NewsSection";
import { NoticesSection } from "@/components/home/NoticesSection";
import { EventsSection } from "@/components/home/EventsSection";
import { GallerySection } from "@/components/home/GallerySection";
import { AdmissionsCta } from "@/components/home/AdmissionsCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} | ${site.shortName} East Kallada`,
  description:
    "Official website of C V K M Higher Secondary School (CVKM HSS), East Kallada, Kollam, Kerala — established 1926. Explore academics, campus, student life and admissions.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <AtAGlance />
      <AcademicsSection />
      <Timeline />
      <Campus />
      <StudentLife />
      <Achievements />
      <NewsSection />
      <NoticesSection />
      <EventsSection />
      <GallerySection />
      <AdmissionsCta />
      <JsonLd
        data={webPageSchema({
          title: `${site.name} | ${site.shortName} East Kallada`,
          description: site.description,
          path: "/",
        })}
      />
    </>
  );
}
