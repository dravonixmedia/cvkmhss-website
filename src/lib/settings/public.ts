import "server-only";

import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";

export interface PublicSiteInfo {
  name: string;
  shortName: string;
  foundingYear: number;
  address: {
    locality: string;
    region: string;
    state: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
    googleMapsUrl?: string;
  };
  socialLinks: { platform: string; url: string }[];
}

const fallback: PublicSiteInfo = {
  name: site.name,
  shortName: site.shortName,
  foundingYear: site.foundingYear,
  address: { ...site.address },
  contact: { ...site.contact },
  socialLinks: [...site.socialLinks],
};

/**
 * Public-safe: never throws — a query failure (or an unconfigured
 * project) degrades to the static src/data/site.ts values, exactly what
 * every page rendered before this settings table existed. Each field
 * falls back independently, so partially-filled settings still work.
 */
export async function getPublicSiteInfo(): Promise<PublicSiteInfo> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) return fallback;

    const socialLinks: { platform: string; url: string }[] = [];
    if (data.facebook_url) socialLinks.push({ platform: "Facebook", url: data.facebook_url });
    if (data.instagram_url) socialLinks.push({ platform: "Instagram", url: data.instagram_url });
    if (data.youtube_url) socialLinks.push({ platform: "YouTube", url: data.youtube_url });

    return {
      name: data.school_name || fallback.name,
      shortName: data.short_name || fallback.shortName,
      foundingYear: data.established_year ?? fallback.foundingYear,
      address: {
        locality: data.address_locality || fallback.address.locality,
        region: data.address_district || fallback.address.region,
        state: data.address_state || fallback.address.state,
        country: fallback.address.country,
      },
      contact: {
        phone: data.phone || fallback.contact.phone,
        email: data.email || fallback.contact.email,
        googleMapsUrl: data.google_maps_url || fallback.contact.googleMapsUrl,
      },
      socialLinks: socialLinks.length > 0 ? socialLinks : fallback.socialLinks,
    };
  } catch (err) {
    console.error("Site settings query failed:", err);
    return fallback;
  }
}
