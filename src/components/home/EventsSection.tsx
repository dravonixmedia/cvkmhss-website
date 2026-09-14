import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getUpcomingEvents } from "@/data/events";
import { formatEventDate } from "@/lib/date";

export function EventsSection() {
  const upcoming = getUpcomingEvents();

  return (
    <section className="border-y border-border bg-paper py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Events" title="Upcoming at CVKM" />
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            View all events <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming events published yet"
              description="School events and programmes will be listed here as they are scheduled."
            />
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {upcoming.slice(0, 3).map((event) => {
                const { day, month } = formatEventDate(event.date);
                return (
                  <li key={event.slug} className="flex items-center gap-6 py-6">
                    <div className="w-16 shrink-0 border-r border-border pr-6 text-center">
                      <div className="font-heading text-3xl leading-none font-bold text-navy">
                        {day}
                      </div>
                      <div className="mt-1 text-xs tracking-[0.14em] text-gold uppercase">
                        {month}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold text-navy">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate">{event.location}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
