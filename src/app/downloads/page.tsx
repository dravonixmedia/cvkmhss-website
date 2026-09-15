import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { downloadCategories } from "@/data/downloads";
import { getPublishedDownloads } from "@/lib/downloads/public";
import { staggerDelay } from "@/lib/stagger";

const title = "Downloads";
const description = "Downloadable academic, admissions and general documents from C V K M Higher Secondary School.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/downloads" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Downloads", href: "/downloads" },
];

export default async function DownloadsPage() {
  const downloads = await getPublishedDownloads();

  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title="Documents & Forms"
        description="Academic, admissions and general documents published by the school."
        breadcrumb={breadcrumb}
      />

      <section className="py-16 sm:py-20">
        <Container className="space-y-12">
          {downloadCategories.map((category, categoryIndex) => {
            const items = downloads.filter((item) => item.category === category);
            return (
              <Reveal key={category} variant="fadeUp" delay={staggerDelay(categoryIndex, 60)}>
                <h2 className="font-heading text-lg font-semibold text-navy">{category}</h2>
                <div className="mt-4">
                  {items.length === 0 ? (
                    <EmptyState
                      title={`No ${category.toLowerCase()} documents published yet`}
                      description="Documents will be published here once available."
                    />
                  ) : (
                    <ul className="divide-y divide-border border-y border-border">
                      {items.map((item) => (
                        <li key={item.title} className="flex items-center justify-between gap-4 py-4">
                          <span className="flex items-center gap-3 text-sm font-medium text-charcoal">
                            <FileText className="h-4 w-4 text-gold" aria-hidden />
                            {item.title}
                          </span>
                          <a href={item.fileUrl} className="text-sm font-medium text-navy hover:underline">
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/downloads" })} />
    </>
  );
}
