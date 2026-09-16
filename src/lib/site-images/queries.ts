import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SiteImageRow } from "@/lib/supabase/database.types";

/** All 8 predefined slot rows, for the admin overview page. */
export async function getAllSiteImagesForAdmin(): Promise<SiteImageRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_images").select("*").order("slot_key");
  return data ?? [];
}
