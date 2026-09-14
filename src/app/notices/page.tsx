import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getImportantNotices, getPublishedNotices } from "@/data/notices";
import { NoticesExplorer } from "@/components/notices/NoticesExplorer";

const title = "Notices";
const description = "Important notices and announcements from C V K M Higher Secondary School.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/notices" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Notices", href: "/notices" },
];

export default function NoticesPage() {
  const important = getImportantNotices();
  const all = getPublishedNotices();

  return (
    <>
      <PageHero
        eyebrow="Notices"
        title="Important Notices"
        description="Official notices and announcements from the school office."
        breadcrumb={breadcrumb}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Important" title="Important Notices" />
          <div className="mt-8">
            {important.length === 0 ? (
              <EmptyState
                title="No important notices at this time"
                description="Time-sensitive notices will be published here."
              />
            ) : (
              <ul className="divide-y divide-border border-y border-border">
                {important.map((notice) => (
                  <li key={notice.slug} className="py-4">
                    <span className="font-medium text-charcoal">{notice.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="All Notices" title="Browse All Notices" />
          <div className="mt-8">
            <NoticesExplorer notices={all} />
          </div>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/notices" })} />
    </>
  );
}
