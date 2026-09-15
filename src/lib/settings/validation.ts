import { optionalText } from "@/lib/validation/cms";

const MAX_SHORT = 120;
const MAX_ADDRESS = 200;
const MAX_URL = 300;

function optionalUrl(formData: FormData, field: string, label: string): { value: string | null } | { error: string } {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return { value: null };
  if (value.length > MAX_URL) return { error: `${label} must be ${MAX_URL} characters or fewer.` };
  if (!/^https:\/\/.+/.test(value)) {
    return { error: `${label} must be a full https:// URL.` };
  }
  return { value };
}

function optionalYear(formData: FormData, field: string, label: string): { value: number | null } | { error: string } {
  const raw = String(formData.get(field) ?? "").trim();
  if (!raw) return { value: null };
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || String(parsed) !== raw || parsed < 1800 || parsed > 2100) {
    return { error: `${label} must be a valid year between 1800 and 2100.` };
  }
  return { value: parsed };
}

function optionalEmail(formData: FormData, field: string, label: string): { value: string | null } | { error: string } {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) return { value: null };
  if (value.length > MAX_SHORT) return { error: `${label} must be ${MAX_SHORT} characters or fewer.` };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { error: `${label} must be a valid email address.` };
  }
  return { value };
}

export interface SiteSettingsFieldValues {
  schoolName: string | null;
  shortName: string | null;
  establishedYear: number | null;
  schoolCode: string | null;
  hssCode: string | null;
  udiseCode: string | null;
  phone: string | null;
  phoneSecondary: string | null;
  email: string | null;
  addressLocality: string | null;
  addressDistrict: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  googleMapsUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
}

export type SiteSettingsValidationResult = { values: SiteSettingsFieldValues } | { error: string };

export function validateSiteSettingsFields(formData: FormData): SiteSettingsValidationResult {
  const fields: Array<[string, string, number]> = [
    ["school_name", "School name", MAX_SHORT],
    ["short_name", "Short name", MAX_SHORT],
    ["school_code", "School code", MAX_SHORT],
    ["hss_code", "HSS code", MAX_SHORT],
    ["udise_code", "UDISE code", MAX_SHORT],
    ["phone", "Phone", MAX_SHORT],
    ["phone_secondary", "Secondary phone", MAX_SHORT],
    ["address_locality", "Locality", MAX_ADDRESS],
    ["address_district", "District", MAX_SHORT],
    ["address_state", "State", MAX_SHORT],
    ["address_postal_code", "Postal code", MAX_SHORT],
  ];

  const text: Record<string, string | null> = {};
  for (const [field, label, maxLength] of fields) {
    const result = optionalText(formData, field, maxLength);
    if ("error" in result) return { error: `${label}: ${result.error}` };
    text[field] = result.value || null;
  }

  const establishedYear = optionalYear(formData, "established_year", "Established year");
  if ("error" in establishedYear) return establishedYear;

  const email = optionalEmail(formData, "email", "Email");
  if ("error" in email) return email;

  const googleMapsUrl = optionalUrl(formData, "google_maps_url", "Google Maps link");
  if ("error" in googleMapsUrl) return googleMapsUrl;

  const facebookUrl = optionalUrl(formData, "facebook_url", "Facebook link");
  if ("error" in facebookUrl) return facebookUrl;

  const instagramUrl = optionalUrl(formData, "instagram_url", "Instagram link");
  if ("error" in instagramUrl) return instagramUrl;

  const youtubeUrl = optionalUrl(formData, "youtube_url", "YouTube link");
  if ("error" in youtubeUrl) return youtubeUrl;

  return {
    values: {
      schoolName: text.school_name,
      shortName: text.short_name,
      establishedYear: establishedYear.value,
      schoolCode: text.school_code,
      hssCode: text.hss_code,
      udiseCode: text.udise_code,
      phone: text.phone,
      phoneSecondary: text.phone_secondary,
      email: email.value,
      addressLocality: text.address_locality,
      addressDistrict: text.address_district,
      addressState: text.address_state,
      addressPostalCode: text.address_postal_code,
      googleMapsUrl: googleMapsUrl.value,
      facebookUrl: facebookUrl.value,
      instagramUrl: instagramUrl.value,
      youtubeUrl: youtubeUrl.value,
    },
  };
}
