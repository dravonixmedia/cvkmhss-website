import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { studentActivities } from "@/data/student-life";

export function StudentLife() {
  return (
    <section className="border-y border-border bg-paper py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Student Life" title="Beyond the Classroom" />
          <Link
            href="/student-life"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            See student life <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {studentActivities.map((activity) => (
            <span
              key={activity.name}
              className="rounded-full border border-border bg-off-white px-5 py-2 text-sm font-medium text-charcoal"
            >
              {activity.name}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
