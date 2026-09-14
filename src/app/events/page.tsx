import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema, eventSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getPastEvents, getUpcomingEvents } from "@/data/events";
import { formatEventDate } from "@/lib/date";
import { pageHeroes } from "@/data/pageHeroes";

const title = "Events";
const description = "Upcoming and past events at C V K M Higher Secondary School, East Kallada.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/events" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
];

function EventList({ events }: { events: ReturnType<typeof getUpcomingEvents> }) {
  return (
    <ul className="divide-y divide-border border-t border-border">
      {events.map((event) => {
        const { day, month } = formatEventDate(event.date);
        return (
          <li key={event.slug} className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start">
            <div className="w-20 shrink-0 border-r border-border pr-6 text-center sm:pr-8">
              <div className="font-heading text-4xl leading-none font-bold text-navy">{day}</div>
              <div className="mt-1.5 text-xs tracking-[0.14em] text-gold uppercase">{month}</div>
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-navy">{event.title}</h3>
              <p className="mt-1 text-sm text-slate">
                {event.location}
                {event.startTime && ` · ${event.startTime}`}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
                {event.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <>
      <LandingHero hero={pageHeroes.events} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Upcoming" title="Upcoming Events" />
          <div className="mt-10">
            {upcoming.length === 0 ? (
              <EmptyState
                title="No upcoming events published yet"
                description="Scheduled school events and programmes will be listed here."
              />
            ) : (
              <EventList events={upcoming} />
            )}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Past" title="Past Events" />
          <div className="mt-10">
            {past.length === 0 ? (
              <EmptyState
                title="No past events on record yet"
                description="A record of past school events will appear here."
              />
            ) : (
              <EventList events={past} />
            )}
          </div>
        </Container>
      </section>

      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/events" }),
          ...[...upcoming, ...past].map((event) => eventSchema(event)),
        ]}
      />
    </>
  );
}
