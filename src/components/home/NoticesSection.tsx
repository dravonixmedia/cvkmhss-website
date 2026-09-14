import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getImportantNotices } from "@/data/notices";

export function NoticesSection() {
  const importantNotices = getImportantNotices();

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Notices" title="Important Notices" />
          <Link
            href="/notices"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            View all notices <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          {importantNotices.length === 0 ? (
            <EmptyState
              title="No important notices at this time"
              description="Time-sensitive notices from the school office will be published here."
            />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {importantNotices.map((notice) => (
                <li key={notice.slug} className="flex flex-wrap items-center justify-between gap-2 py-4">
                  <span className="font-medium text-charcoal">{notice.title}</span>
                  <span className="text-xs text-slate">{notice.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
