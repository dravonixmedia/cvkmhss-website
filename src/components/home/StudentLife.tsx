import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { studentActivities } from "@/data/student-life";
import { staggerDelay } from "@/lib/stagger";

export function StudentLife() {
  return (
    <section className="border-y border-border bg-paper py-20 sm:py-24">
      <Container>
        <Reveal variant="fadeUp">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Student Life" title="Beyond the Classroom" />
            <Link
              href="/student-life"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
            >
              See student life <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="relative order-2 h-72 sm:h-96 lg:order-1 lg:h-auto">
            <PhotoPlaceholder
              caption="Student activities at CVKM"
              tone="navy"
              focal="top-left"
              className="absolute inset-0"
            />
          </div>

          <div className="order-1 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 lg:order-2">
            {studentActivities.map((activity, index) => (
              <Reveal key={activity.name} variant="fadeUp" delay={staggerDelay(index, 70)}>
                <span className="text-xs font-semibold text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading mt-1 text-base font-semibold text-navy">
                  {activity.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate sm:text-sm">
                  {activity.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
