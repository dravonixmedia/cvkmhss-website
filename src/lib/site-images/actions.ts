"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { isSiteImageSlotKey, type SiteImageSlotKey } from "@/lib/site-images/slots";
import { validateSiteImageFile, validateSiteImageAltText } from "@/lib/site-images/validation";
import { uploadSiteImage, deleteSiteImage } from "@/lib/site-images/storage";

export interface SiteImageFormState {
  error?: string;
  success?: boolean;
}

const GENERIC_SAVE_ERROR = "Could not save this image. Please check the file and try again.";

/** Every public page reading site_images is revalidated after any change — the set is small and fixed. */
const PUBLIC_PATHS_BY_SLOT: Record<SiteImageSlotKey, string[]> = {
  home_hero: ["/"],
  home_campus_highlight: ["/"],
  home_student_life_highlight: ["/"],
  about_hero: ["/about"],
  academics_hero: ["/academics"],
  campus_hero: ["/campus"],
  student_life_hero: ["/student-life"],
  admissions_hero: ["/admissions"],
};

function revalidateSlot(slotKey: SiteImageSlotKey) {
  revalidatePath("/admin/website-images");
  for (const path of PUBLIC_PATHS_BY_SLOT[slotKey]) revalidatePath(path);
}

export async function updateSiteImage(
  slotKey: SiteImageSlotKey,
  _prevState: SiteImageFormState,
  formData: FormData
): Promise<SiteImageFormState> {
  const admin = await requireAdmin();

  // Defense in depth — slotKey is always one of the bound, known values
  // from the admin page's own slot list, never user-submitted, but this
  // keeps the action safe even if that ever changes.
  if (!isSiteImageSlotKey(slotKey)) {
    return { error: GENERIC_SAVE_ERROR };
  }

  const altResult = validateSiteImageAltText(formData);
  if ("error" in altResult) return altResult;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_images")
    .select("image_path")
    .eq("slot_key", slotKey)
    .maybeSingle();

  const file = formData.get("image");
  let imagePath = existing?.image_path ?? null;

  if (file instanceof File && file.size > 0) {
    const validation = validateSiteImageFile(file);
    if ("error" in validation) return validation;

    const uploaded = await uploadSiteImage(file);
    if ("error" in uploaded) return uploaded;
    imagePath = uploaded.path;
  }

  const { error } = await supabase
    .from("site_images")
    .update({
      image_path: imagePath,
      alt_text: altResult.value || null,
      updated_by: admin.profile.id,
    })
    .eq("slot_key", slotKey);

  if (error) return { error: GENERIC_SAVE_ERROR };

  if (existing?.image_path && imagePath !== existing.image_path) {
    await deleteSiteImage(existing.image_path);
  }

  revalidateSlot(slotKey);
  return { success: true };
}

export async function removeSiteImage(slotKey: SiteImageSlotKey): Promise<void> {
  const admin = await requireAdmin();
  if (!isSiteImageSlotKey(slotKey)) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("site_images")
    .select("image_path")
    .eq("slot_key", slotKey)
    .maybeSingle();

  const { error } = await supabase
    .from("site_images")
    .update({ image_path: null, alt_text: null, updated_by: admin.profile.id })
    .eq("slot_key", slotKey);

  if (!error && existing?.image_path) {
    await deleteSiteImage(existing.image_path);
  }

  revalidateSlot(slotKey);
}
