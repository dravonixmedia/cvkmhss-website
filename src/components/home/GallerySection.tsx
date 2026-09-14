import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
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

        <div className="mt-10 grid auto-rows-[7rem] grid-cols-2 gap-3 sm:auto-rows-[8.5rem] sm:grid-cols-4 sm:grid-flow-dense">
          {galleryCategories.map((category, index) => (
            <div
              key={category}
              className={`relative ${index === 0 ? "col-span-2 row-span-2" : index === 5 ? "sm:col-span-2" : ""}`}
            >
              <PhotoPlaceholder
                caption={category}
                tone={index % 3 === 0 ? "navy" : "ivory"}
                focal={index % 2 === 0 ? "bottom-left" : "top-right"}
                compact={index !== 0}
                className="absolute inset-0"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
