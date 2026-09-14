import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryCategories } from "@/data/gallery";

export function GallerySection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Gallery" title="Life at CVKM" />
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            View the gallery <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {galleryCategories.map((category) => (
            <div
              key={category}
              className="flex aspect-square flex-col items-center justify-center gap-2 border border-border bg-paper p-4 text-center"
            >
              <ImageIcon className="h-6 w-6 text-gold" aria-hidden />
              <span className="text-xs font-medium text-slate">{category}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
