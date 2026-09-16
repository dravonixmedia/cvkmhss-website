import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllSiteImagesForAdmin } from "@/lib/site-images/queries";
import { signSiteImageUrls } from "@/lib/site-images/storage";
import { updateSiteImage, removeSiteImage } from "@/lib/site-images/actions";
import { SITE_IMAGE_SLOTS } from "@/lib/site-images/slots";
import { SiteImageSlotForm } from "@/components/admin/SiteImageSlotForm";

export const metadata: Metadata = buildMetadata({
  title: "Website Images",
  description: "Manage predefined photography positions across the public website.",
  path: "/admin/website-images",
  noIndex: true,
});

export default async function AdminWebsiteImagesPage() {
  await requireAdmin();

  const rows = await getAllSiteImagesForAdmin();
  const imageUrls = await signSiteImageUrls(rows.map((row) => row.image_path));
  const urlByKey = new Map(rows.map((row, index) => [row.slot_key, imageUrls[index]]));
  const rowByKey = new Map(rows.map((row) => [row.slot_key, row]));

  const groups = Array.from(new Set(SITE_IMAGE_SLOTS.map((slot) => slot.group)));

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Website Images</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate">
        Replace the placeholder artwork used in these fixed positions across the public website.
        Leaving a position empty keeps its existing placeholder visible — nothing on the site
        breaks either way.
      </p>

      {groups.map((group) => (
        <section key={group} className="mt-10">
          <h2 className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
            {group}
          </h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {SITE_IMAGE_SLOTS.filter((slot) => slot.group === group).map((slot) => {
              const row = rowByKey.get(slot.key);
              const updateAction = updateSiteImage.bind(null, slot.key);
              const removeAction = removeSiteImage.bind(null, slot.key);

              return (
                <SiteImageSlotForm
                  key={slot.key}
                  slot={slot}
                  currentImageUrl={urlByKey.get(slot.key) ?? null}
                  currentAltText={row?.alt_text ?? null}
                  action={updateAction}
                  removeAction={removeAction}
                />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
