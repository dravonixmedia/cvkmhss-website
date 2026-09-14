import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { facilities } from "@/data/campus";

export function Campus() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Campus" title="A Campus Built for Learning" />
          <Link
            href="/campus"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            Explore the campus <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((facility) => (
            <li key={facility.name} className="border-t border-gold pt-4">
              <h3 className="font-heading text-base font-semibold text-navy">{facility.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate">{facility.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
