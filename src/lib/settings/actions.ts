"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { validateSiteSettingsFields } from "@/lib/settings/validation";

export interface SiteSettingsFormState {
  error?: string;
  success?: boolean;
}

const GENERIC_SAVE_ERROR = "Could not save settings. Please check the details and try again.";

/** Both roles may edit — every field here is ordinary public school/contact/social content. */
export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  const admin = await requireAdmin();

  const parsed = validateSiteSettingsFields(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      school_name: parsed.values.schoolName,
      short_name: parsed.values.shortName,
      established_year: parsed.values.establishedYear,
      school_code: parsed.values.schoolCode,
      hss_code: parsed.values.hssCode,
      udise_code: parsed.values.udiseCode,
      phone: parsed.values.phone,
      phone_secondary: parsed.values.phoneSecondary,
      email: parsed.values.email,
      address_locality: parsed.values.addressLocality,
      address_district: parsed.values.addressDistrict,
      address_state: parsed.values.addressState,
      address_postal_code: parsed.values.addressPostalCode,
      google_maps_url: parsed.values.googleMapsUrl,
      facebook_url: parsed.values.facebookUrl,
      instagram_url: parsed.values.instagramUrl,
      youtube_url: parsed.values.youtubeUrl,
      updated_by: admin.profile.id,
    })
    .eq("id", 1);

  if (error) return { error: GENERIC_SAVE_ERROR };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}
