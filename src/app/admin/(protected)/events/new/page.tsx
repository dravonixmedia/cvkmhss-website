import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { createEvent } from "@/lib/events/actions";
import { EventForm } from "@/components/admin/EventForm";

export const metadata: Metadata = buildMetadata({
  title: "Add Event",
  description: "Add a new Event.",
  path: "/admin/events/new",
  noIndex: true,
});

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add Event</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this event visible on the public Events page
        immediately. A URL slug is generated automatically from the title.
      </p>

      <div className="mt-8">
        <EventForm
          mode="create"
          action={createEvent}
          initialValues={{
            title: "",
            eventDate: "",
            startTime: "",
            endTime: "",
            location: "",
            description: "",
            imageUrl: null,
          }}
        />
      </div>
    </div>
  );
}
