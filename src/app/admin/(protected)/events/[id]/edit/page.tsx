import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getEventByIdForAdmin } from "@/lib/events/queries";
import { signEventImageUrl } from "@/lib/events/storage";
import { updateEvent, setEventStatus } from "@/lib/events/actions";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Event",
  description: "Edit an Event.",
  path: "/admin/events",
  noIndex: true,
});

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const event = await getEventByIdForAdmin(id);
  if (!event) {
    notFound();
  }

  const imageUrl = await signEventImageUrl(event.image);
  const updateAction = updateEvent.bind(null, event.id);
  const togglePublish = setEventStatus.bind(
    null,
    event.id,
    event.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit Event</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {event.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <form action={togglePublish}>
          <button
            type="submit"
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            {event.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <EventForm
          mode="edit"
          action={updateAction}
          initialValues={{
            slug: event.slug,
            title: event.title,
            eventDate: event.event_date,
            startTime: event.start_time?.slice(0, 5) ?? "",
            endTime: event.end_time?.slice(0, 5) ?? "",
            location: event.location,
            description: event.description,
            imageUrl,
          }}
        />
      </div>
    </div>
  );
}
