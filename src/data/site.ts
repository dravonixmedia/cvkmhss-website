import type { FactItem, TimelineEntry } from "@/types";

/**
 * Single source of truth for verified institutional facts.
 * Do not add unverified figures, names, dates, or contact details here —
 * see repository README "Content Policy" for the rule this file follows.
 */
export const site = {
  name: "C V K M Higher Secondary School",
  shortName: "CVKM HSS",
  alternateName: "CVKM HSS",
  legalName: "C V K M Higher Secondary School",
  tagline: "A Legacy of Learning. A Future of Possibilities.",
  description:
    "Official website of C V K M Higher Secondary School, East Kallada, Kollam, Kerala — serving generations of learners since 1926.",
  foundingYear: 1926,
  higherSecondaryStartYear: 2000,
  url: "https://www.cvkmhss.org",
  logo: "/images/cvkm-hss-logo-placeholder.svg",
  logoAlt: "C V K M Higher Secondary School official emblem",
  address: {
    locality: "East Kallada",
    region: "Kollam",
    state: "Kerala",
    country: "India",
    // streetAddress and postalCode are intentionally omitted until verified —
    // do not fabricate these. Add them here once confirmed by the school.
  },
  contact: {
    // Verified phone/email are not yet available. Leave undefined rather
    // than inventing values; UI components must render an editable
    // placeholder state when these are absent.
    phone: undefined as string | undefined,
    email: undefined as string | undefined,
    googleMapsUrl: undefined as string | undefined,
  },
  socialLinks: [] as { platform: string; url: string }[],
  developer: {
    name: "Dravonix Media",
    url: "https://dravonixmedia.com/",
  },
} as const;

export const glanceFacts: FactItem[] = [
  { value: "100", label: "Years of Educational Legacy" },
  { value: "4", label: "Acre Campus" },
  { value: "17", label: "Smart Classrooms" },
  { value: "5,800+", label: "Library Books" },
];

export const legacyTimeline: TimelineEntry[] = [
  {
    year: "1926",
    title: "The Beginning",
    description: "Beginning of the institution in East Kallada.",
  },
  {
    year: "2000",
    title: "Higher Secondary Begins",
    description: "The Higher Secondary section begins at CVKM.",
  },
  {
    year: "Today",
    title: "Learning, Technology & Activity",
    description:
      "Academics, technology, activities and student development continue to grow.",
  },
  {
    year: "The Future",
    title: "The Next Generation",
    description: "Preparing the next generation of learners and leaders.",
  },
];

export const positioningPillars = [
  {
    name: "Legacy",
    description: "A century-rooted institution serving East Kallada since 1926.",
  },
  {
    name: "Learning",
    description: "Structured academic pathways from Class V through Higher Secondary.",
  },
  {
    name: "Leadership",
    description: "Activities and programmes that build responsibility and character.",
  },
  {
    name: "Innovation",
    description: "Technology-enabled classrooms and student-led projects.",
  },
] as const;

/** Approved content positioning used to frame About/Introduction copy. */
export const approvedPositioning = [
  "Legacy",
  "Academics",
  "Campus",
  "Student Life",
  "Achievements",
  "Future",
] as const;
