import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { achievementCategories, achievements } from "@/data/achievements";
import { AchievementsExplorer } from "@/components/achievements/AchievementsExplorer";

const title = "Achievements";
const description =
  "Academic, sports, arts, innovation and competition achievements of students and CVKM Higher Secondary School.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/achievements" });

export default function AchievementsPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Achievements", href: "/achievements" }]}
      />
      <PageHero eyebrow="Achievements" title="Celebrating Progress" />

      <section className="py-16 sm:py-20">
        <Container>
          <AchievementsExplorer categories={achievementCategories} items={achievements} />
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/achievements" })} />
    </>
  );
}
