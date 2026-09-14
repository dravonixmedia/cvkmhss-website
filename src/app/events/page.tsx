import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema, eventSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getPastEvents, getUpcomingEvents } from "@/data/events";

const title = "Events";
const description = "Upcoming and past events at C V K M Higher Secondary School, East Kallada.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/events" });

function EventList({ events }: { events: ReturnType<typeof getUpcomingEvents> }) {
  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.slug} className="border border-border bg-paper p-6">
          <p className="text-xs font-semibold tracking-wide text-gold uppercase">{event.date}</p>
          <h3 className="font-heading mt-2 text-base font-semibold text-navy">{event.title}</h3>
          <p className="mt-1 text-sm text-slate">{event.location}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate">{event.description}</p>
        </li>
      ))}
    </ul>
  );
}

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }]} />
      <PageHero eyebrow="Events" title="School Events" />

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
