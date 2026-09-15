import type { Metadata } from "next";
import Image from "next/image";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { galleryCategories } from "@/data/gallery";
import { getPublishedGalleryAlbums } from "@/lib/gallery/public";
import { pageHeroes } from "@/data/pageHeroes";
import { staggerDelay } from "@/lib/stagger";

const title = "Gallery";
const description = "Photo gallery of campus, classrooms, events, sports and student activities at CVKM HSS.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/gallery" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
];

export default async function GalleryPage() {
  const galleryAlbums = await getPublishedGalleryAlbums();

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
                    hoverScale
                    delay={staggerDelay(index, 55)}
                    className="absolute inset-0"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {galleryAlbums.map((album, index) => (
                <div key={album.slug} className="group relative aspect-[4/3] overflow-hidden">
                  {album.cover ? (
                    <>
                      <Image
                        src={album.cover}
                        alt={album.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.025]"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-4">
                        <span className="block truncate text-[11px] font-semibold tracking-[0.16em] text-gold-light/90 uppercase">
                          {album.title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <PhotoPlaceholder
                      caption={album.title}
                      tone="navy"
                      hoverScale
                      delay={staggerDelay(index, 55)}
                      className="absolute inset-0"
                    />
                  )}
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
