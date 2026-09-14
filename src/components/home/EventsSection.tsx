import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getUpcomingEvents } from "@/data/events";

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
            <ul className="grid gap-8 sm:grid-cols-3">
              {upcoming.slice(0, 3).map((event) => (
                <li key={event.slug} className="border-l-2 border-gold pl-4">
                  <div className="text-xs font-semibold tracking-wide text-gold uppercase">
                    {event.date}
                  </div>
                  <h3 className="font-heading mt-1 text-base font-semibold text-navy">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate">{event.location}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
