import type { Metadata } from "next";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { galleryAlbums, galleryCategories } from "@/data/gallery";
import { pageHeroes } from "@/data/pageHeroes";

const title = "Gallery";
const description = "Photo gallery of campus, classrooms, events, sports and student activities at CVKM HSS.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/gallery" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
];

export default function GalleryPage() {
  return (
    <>
      <LandingHero hero={pageHeroes.gallery} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container>
          {galleryAlbums.length === 0 ? (
            <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-3 sm:grid-flow-dense lg:grid-cols-4">
              {galleryCategories.map((category, index) => (
                <div
                  key={category}
                  className={`relative ${index === 0 ? "col-span-2 row-span-2" : ""}`}
                >
                  <PhotoPlaceholder
                    caption={category}
                    tone={index % 3 === 1 ? "ivory" : "navy"}
                    focal={index % 2 === 0 ? "bottom-left" : "top-right"}
                    compact={index !== 0}
                    className="absolute inset-0"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {galleryAlbums.map((album) => (
                <div key={album.slug} className="relative aspect-[4/3]">
                  <PhotoPlaceholder
                    caption={album.title}
                    tone="navy"
                    className="absolute inset-0"
                  />
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
