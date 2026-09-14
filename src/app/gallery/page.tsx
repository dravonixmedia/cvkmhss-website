import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { galleryAlbums, galleryCategories } from "@/data/gallery";

const title = "Gallery";
const description = "Photo gallery of campus, classrooms, events, sports and student activities at CVKM HSS.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/gallery" });

export default function GalleryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery", href: "/gallery" }]} />
      <PageHero eyebrow="Gallery" title="Life at CVKM" />

      <section className="py-16 sm:py-20">
        <Container>
          {galleryAlbums.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryCategories.map((category) => (
                <div
                  key={category}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border border-dashed border-border bg-paper p-6 text-center"
                >
                  <ImageIcon className="h-8 w-8 text-gold" aria-hidden />
                  <span className="font-heading text-sm font-semibold text-navy">{category}</span>
                  <span className="text-xs text-slate">Official photographs coming soon</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryAlbums.map((album) => (
                <div key={album.slug} className="border border-border bg-paper p-4">
                  <p className="text-xs font-semibold tracking-wide text-gold uppercase">
                    {album.category}
                  </p>
                  <h3 className="font-heading mt-1 text-base font-semibold text-navy">
                    {album.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate">{album.description}</p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/gallery" })} />
    </>
  );
}
