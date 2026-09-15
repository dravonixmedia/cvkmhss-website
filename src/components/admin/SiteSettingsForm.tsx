"use client";

import { useActionState } from "react";
import type { SiteSettingsFormState } from "@/lib/settings/actions";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";
import type { SiteSettingsRow } from "@/lib/supabase/database.types";

const initialState: SiteSettingsFormState = {};

export function SiteSettingsForm({
  action,
  settings,
}: {
  action: (prevState: SiteSettingsFormState, formData: FormData) => Promise<SiteSettingsFormState>;
  settings: SiteSettingsRow | null;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-3xl space-y-10" noValidate>
      <fieldset className="space-y-6">
        <legend className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
          School Information
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="school_name" className={labelClasses}>
              Official School Name
            </label>
            <input
              id="school_name"
              name="school_name"
              type="text"
              maxLength={120}
              defaultValue={settings?.school_name ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="short_name" className={labelClasses}>
              Short / Display Name
            </label>
            <input
              id="short_name"
              name="short_name"
              type="text"
              maxLength={120}
              defaultValue={settings?.short_name ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="established_year" className={labelClasses}>
              Established Year
            </label>
            <input
              id="established_year"
              name="established_year"
              type="number"
              min={1800}
              max={2100}
              defaultValue={settings?.established_year ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="school_code" className={labelClasses}>
              School Code
            </label>
            <input
              id="school_code"
              name="school_code"
              type="text"
              maxLength={120}
              defaultValue={settings?.school_code ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="hss_code" className={labelClasses}>
              HSS Code
            </label>
            <input
              id="hss_code"
              name="hss_code"
              type="text"
              maxLength={120}
              defaultValue={settings?.hss_code ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="udise_code" className={labelClasses}>
              UDISE Code
            </label>
            <input
              id="udise_code"
              name="udise_code"
              type="text"
              maxLength={120}
              defaultValue={settings?.udise_code ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
          Contact
        </legend>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClasses}>
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              maxLength={120}
              defaultValue={settings?.phone ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="phone_secondary" className={labelClasses}>
              Secondary Phone <span className="text-slate normal-case">(optional)</span>
            </label>
            <input
              id="phone_secondary"
              name="phone_secondary"
              type="text"
              maxLength={120}
              defaultValue={settings?.phone_secondary ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              maxLength={120}
              defaultValue={settings?.email ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="google_maps_url" className={labelClasses}>
              Google Maps Link <span className="text-slate normal-case">(optional)</span>
            </label>
            <input
              id="google_maps_url"
              name="google_maps_url"
              type="url"
              placeholder="https://maps.google.com/…"
              maxLength={300}
              defaultValue={settings?.google_maps_url ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="address_locality" className={labelClasses}>
              Locality
            </label>
            <input
              id="address_locality"
              name="address_locality"
              type="text"
              maxLength={200}
              defaultValue={settings?.address_locality ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="address_district" className={labelClasses}>
              District
            </label>
            <input
              id="address_district"
              name="address_district"
              type="text"
              maxLength={120}
              defaultValue={settings?.address_district ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="address_state" className={labelClasses}>
              State
            </label>
            <input
              id="address_state"
              name="address_state"
              type="text"
              maxLength={120}
              defaultValue={settings?.address_state ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="address_postal_code" className={labelClasses}>
              Postal Code
            </label>
            <input
              id="address_postal_code"
              name="address_postal_code"
              type="text"
              maxLength={120}
              defaultValue={settings?.address_postal_code ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
          Social / External Links
        </legend>
        <p className="text-xs text-slate">
          Only add links to official school-run accounts. Leave blank if none exists yet.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="facebook_url" className={labelClasses}>
              Facebook
            </label>
            <input
              id="facebook_url"
              name="facebook_url"
              type="url"
              placeholder="https://facebook.com/…"
              maxLength={300}
              defaultValue={settings?.facebook_url ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="instagram_url" className={labelClasses}>
              Instagram
            </label>
            <input
              id="instagram_url"
              name="instagram_url"
              type="url"
              placeholder="https://instagram.com/…"
              maxLength={300}
              defaultValue={settings?.instagram_url ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
          <div>
            <label htmlFor="youtube_url" className={labelClasses}>
              YouTube
            </label>
            <input
              id="youtube_url"
              name="youtube_url"
              type="url"
              placeholder="https://youtube.com/…"
              maxLength={300}
              defaultValue={settings?.youtube_url ?? ""}
              disabled={pending}
              className={fieldClasses}
            />
          </div>
        </div>
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      {state.success && !state.error && (
        <p role="status" className="text-sm font-medium text-emerald-700">
          Settings saved.
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
