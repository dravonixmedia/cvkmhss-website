import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { academicStages } from "@/data/academics";

export function AcademicsSection() {
  const higherSecondary = academicStages.find((stage) => stage.id === "higher-secondary");
  const foundational = academicStages.find((stage) => stage.id === "classes-v-x");

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Academics" title="Learning for Every Stage" />
          <Link
            href="/academics"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            View full academics <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div className="border-l-2 border-gold pl-6">
            <h3 className="font-heading text-xl font-semibold text-navy">{foundational?.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{foundational?.description}</p>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold text-navy">{higherSecondary?.name}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
              {higherSecondary?.description}
            </p>
            <div className="mt-8 grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {higherSecondary?.streams?.map((stream) => (
                <div key={stream.name} className="py-5 sm:px-6 sm:py-0 sm:first:pl-0">
                  <h4 className="font-heading text-sm font-semibold tracking-[0.15em] text-navy uppercase">
                    {stream.name}
                  </h4>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate">
                    {stream.subjects.map((subject) => (
                      <li key={subject.name}>{subject.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
