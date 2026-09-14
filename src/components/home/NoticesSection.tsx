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
            <div className="border-y border-border">
              <div className="hidden grid-cols-[6rem_10rem_1fr] gap-4 border-b border-border py-3 text-xs font-semibold tracking-[0.14em] text-slate uppercase sm:grid">
                <span>Date</span>
                <span>Category</span>
                <span>Notice</span>
              </div>
              <ul className="divide-y divide-border">
                {importantNotices.map((notice) => (
                  <li
                    key={notice.slug}
                    className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[6rem_10rem_1fr] sm:items-center sm:gap-4"
                  >
                    <span className="text-xs font-medium text-gold sm:text-sm">{notice.date}</span>
                    <span className="text-xs tracking-wide text-slate uppercase">{notice.category}</span>
                    <span className="font-medium text-charcoal">{notice.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
