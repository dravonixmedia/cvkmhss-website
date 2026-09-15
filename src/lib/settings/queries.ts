import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsRow } from "@/lib/supabase/database.types";

export async function getSiteSettingsForAdmin(): Promise<SiteSettingsRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ?? null;
}
