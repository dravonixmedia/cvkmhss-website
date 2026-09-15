import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettingsForAdmin } from "@/lib/settings/queries";
import { updateSiteSettings } from "@/lib/settings/actions";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const metadata: Metadata = buildMetadata({
  title: "Settings",
  description: "Manage CVKM HSS school and website settings.",
  path: "/admin/settings",
  noIndex: true,
});

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await getSiteSettingsForAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Settings</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate">
        School identity, contact and social information shown across the public website (footer,
        Contact page). Leave a field blank if it isn&apos;t verified yet — nothing here is
        infrastructure or developer configuration.
      </p>

      <div className="mt-8">
        <SiteSettingsForm action={updateSiteSettings} settings={settings} />
      </div>
    </div>
  );
}
