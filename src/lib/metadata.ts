import type { Metadata } from "next";
import { site } from "@/data/site";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

/** Builds consistent per-page Metadata (title, description, canonical, OG, Twitter). */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex,
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
      // Falls back to the root opengraph-image.tsx convention when no
      // page-specific image (e.g. a news article's featured image) is given.
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
