import type { PageHeroConfig } from "@/types";

/**
 * Centralised hero configuration for every primary landing page. Swapping
 * placeholder photography for official CVKM images later is a matter of
 * updating the image handling inside src/components/hero/LandingHero.tsx —
 * this file only needs a caption, not a path, until real photos exist.
 */
export const pageHeroes: Record<string, PageHeroConfig> = {
  about: {
    page: "about",
    eyebrow: "Our Story",
    title: "A Legacy That Began in 1926",
    description:
      "For a century, C V K M Higher Secondary School has served East Kallada — a continuing institution shaped by the generations who have studied here.",
    variant: "editorial",
    imageCaption: "CVKM campus, East Kallada",
    heritageMark: "1926",
    ctas: [{ label: "Explore Admissions", href: "/admissions", variant: "gold" }],
  },
  academics: {
    page: "academics",
    eyebrow: "Academics",
    title: "Learning for Every Stage",
    description:
      "Structured academic pathways from Class V through Higher Secondary, across Science, Computer Science and Humanities.",
    variant: "split",
    imageCaption: "Classrooms at CVKM",
    ctas: [{ label: "View Admissions", href: "/admissions", variant: "secondary" }],
  },
  campus: {
    page: "campus",
    eyebrow: "Campus & Facilities",
    title: "A Campus Built for Learning",
    description: "A four-acre campus in East Kallada, equipped for academics, technology and everyday school life.",
    variant: "fullBleed",
    imageCaption: "CVKM campus grounds",
  },
  "student-life": {
    page: "student-life",
    eyebrow: "Student Life",
    title: "Beyond the Classroom",
    description:
      "NCC, NSS, Scouts & Guides, Little KITES, sports, arts and student-led projects — the life of CVKM outside the timetable.",
    variant: "collage",
    imageCaption: "Student activities at CVKM",
  },
  achievements: {
    page: "achievements",
    eyebrow: "Achievements",
    title: "Celebrating Progress",
    description: "A record of what CVKM students and the school have accomplished, as it is confirmed.",
    variant: "editorial",
    imageCaption: "Student recognition at CVKM",
  },
  admissions: {
    page: "admissions",
    eyebrow: "Admissions",
    title: "Begin Your Journey With CVKM",
    description: "Admission enquiries are welcome. Detailed dates and requirements will be published here once confirmed.",
    variant: "split",
    imageCaption: "Welcoming students at CVKM",
    ctas: [
      { label: "Explore Programmes", href: "/academics", variant: "gold" },
      { label: "Contact School", href: "/contact", variant: "ghost" },
    ],
  },
  news: {
    page: "news",
    eyebrow: "News & Updates",
    title: "Latest from CVKM",
    description: "Announcements and school news, published as they are confirmed.",
    variant: "lowerTitle",
    imageCaption: "Campus life at CVKM",
  },
  events: {
    page: "events",
    eyebrow: "Events",
    title: "What's Happening at CVKM",
    description: "Upcoming and past events at C V K M Higher Secondary School, East Kallada.",
    variant: "overlay",
    imageCaption: "School programmes at CVKM",
  },
  gallery: {
    page: "gallery",
    eyebrow: "Gallery",
    title: "Life at CVKM",
    description: "Campus, classrooms, events, sports and student activities — a visual record of school life, as photography becomes available.",
    variant: "collage",
    imageCaption: "CVKM in pictures",
  },
  contact: {
    page: "contact",
    eyebrow: "Contact",
    title: "Connect With CVKM",
    description: "C V K M Higher Secondary School, East Kallada, Kollam, Kerala.",
    variant: "lowerTitle",
    imageCaption: "CVKM school entrance",
    short: true,
  },
};
