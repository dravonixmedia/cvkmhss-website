import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { achievementCategories, achievements } from "@/data/achievements";
import { AchievementsExplorer } from "@/components/achievements/AchievementsExplorer";
import { pageHeroes } from "@/data/pageHeroes";

const title = "Achievements";
const description =
  "Academic, sports, arts, innovation and competition achievements of students and CVKM Higher Secondary School.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/achievements" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Achievements", href: "/achievements" },
];

export default function AchievementsPage() {
  return (
    <>
      <LandingHero hero={pageHeroes.achievements} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container>
          <AchievementsExplorer categories={achievementCategories} items={achievements} />
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/achievements" })} />
    </>
  );
}
