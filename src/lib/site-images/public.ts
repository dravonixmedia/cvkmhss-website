import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signSiteImageUrl } from "@/lib/site-images/storage";
import type { SiteImageSlotKey } from "@/lib/site-images/slots";

export interface PublicSiteImage {
  url: string;
  alt: string | null;
}

/**
 * Public-safe: never throws. Returns null whenever there is nothing
 * usable to render (no image configured for this slot, or a genuine
 * failure resolving it) — the caller always falls back to the existing
 * PhotoPlaceholder in that case, exactly as it did before this slot
 * existed. A resolution failure is logged server-side only.
 */
export async function getSiteImage(slotKey: SiteImageSlotKey): Promise<PublicSiteImage | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_images")
      .select("image_path, alt_text")
      .eq("slot_key", slotKey)
      .maybeSingle();

    if (error || !data?.image_path) return null;

    const url = await signSiteImageUrl(data.image_path);
    if (!url) return null;

    return { url, alt: data.alt_text };
  } catch (err) {
    console.error(`getSiteImage(${slotKey}) failed:`, err);
    return null;
  }
}
