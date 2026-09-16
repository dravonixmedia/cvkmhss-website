/**
 * The closed, application-controlled set of static-website photography
 * positions this system manages — mirrors the `site_images_slot_key_known`
 * check constraint in supabase/migrations/20260101000018_site_images.sql.
 * Nothing here is user-invented: every slot corresponds to an existing
 * PhotoPlaceholder position already rendered on the public site (see the
 * repository's site-images audit for the full inventory, including the
 * placeholders deliberately NOT made into a slot here — per-item grids
 * like the Campus facilities/Student Life activity tiles, and every page
 * that belongs to a CMS domain: News, Events, Achievements, Gallery,
 * Management & Leadership).
 */

export const SITE_IMAGE_SLOT_KEYS = [
  "home_hero",
  "home_campus_highlight",
  "home_student_life_highlight",
  "about_hero",
  "academics_hero",
  "campus_hero",
  "student_life_hero",
  "admissions_hero",
] as const;

export type SiteImageSlotKey = (typeof SITE_IMAGE_SLOT_KEYS)[number];

export function isSiteImageSlotKey(value: string): value is SiteImageSlotKey {
  return (SITE_IMAGE_SLOT_KEYS as readonly string[]).includes(value);
}

export interface SiteImageRecommendation {
  dimensions: string;
  orientation: string;
  tip: string;
}

export interface SiteImageSlotDef {
  key: SiteImageSlotKey;
  label: string;
  group: string;
  /** Where this image is used on the public page. */
  purpose: "hero" | "section";
  recommendation: SiteImageRecommendation;
  /** Literal Tailwind classes (aspect ratio must match the real public container) for the admin preview box. */
  previewContainerClassName: string;
}

const heroFullBleedRecommendation: SiteImageRecommendation = {
  dimensions: "1920 × 1080 px",
  orientation: "landscape, 16:9",
  tip: "Center the main subject — the top and bottom may crop on tall screens.",
};

const heroStandardRecommendation: SiteImageRecommendation = {
  dimensions: "1600 × 1200 px",
  orientation: "landscape, 4:3",
  tip: "Keep important subjects and text away from the edges.",
};

const homeSectionRecommendation: SiteImageRecommendation = {
  dimensions: "1600 × 1067 px",
  orientation: "landscape, 3:2",
  tip: "Keep important subjects away from the edges.",
};

const previewClass16by9 =
  "relative mt-2 aspect-[16/9] w-full max-w-sm overflow-hidden border border-border";
const previewClass4by3 =
  "relative mt-2 aspect-[4/3] w-full max-w-sm overflow-hidden border border-border";
const previewClass3by2 =
  "relative mt-2 aspect-[3/2] w-full max-w-sm overflow-hidden border border-border";

export const SITE_IMAGE_SLOTS: SiteImageSlotDef[] = [
  {
    key: "home_hero",
    label: "Home Hero",
    group: "Home",
    purpose: "hero",
    recommendation: heroFullBleedRecommendation,
    previewContainerClassName: previewClass16by9,
  },
  {
    key: "home_campus_highlight",
    label: "Campus Highlight",
    group: "Home",
    purpose: "section",
    recommendation: homeSectionRecommendation,
    previewContainerClassName: previewClass3by2,
  },
  {
    key: "home_student_life_highlight",
    label: "Student Life Highlight",
    group: "Home",
    purpose: "section",
    recommendation: homeSectionRecommendation,
    previewContainerClassName: previewClass3by2,
  },
  {
    key: "about_hero",
    label: "About Hero",
    group: "About",
    purpose: "hero",
    recommendation: heroStandardRecommendation,
    previewContainerClassName: previewClass4by3,
  },
  {
    key: "academics_hero",
    label: "Academics Hero",
    group: "Academics",
    purpose: "hero",
    recommendation: heroStandardRecommendation,
    previewContainerClassName: previewClass4by3,
  },
  {
    key: "campus_hero",
    label: "Campus Hero",
    group: "Campus & Facilities",
    purpose: "hero",
    recommendation: heroFullBleedRecommendation,
    previewContainerClassName: previewClass16by9,
  },
  {
    key: "student_life_hero",
    label: "Student Life Hero",
    group: "Student Life",
    purpose: "hero",
    recommendation: heroStandardRecommendation,
    previewContainerClassName: previewClass4by3,
  },
  {
    key: "admissions_hero",
    label: "Admissions Hero",
    group: "Admissions",
    purpose: "hero",
    recommendation: heroStandardRecommendation,
    previewContainerClassName: previewClass4by3,
  },
];
