import type { NavItem } from "@/types";

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Campus", href: "/campus" },
  { label: "Student Life", href: "/student-life" },
  { label: "Achievements", href: "/achievements" },
  {
    label: "News & Events",
    href: "/news",
    children: [
      { label: "News", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Notices", href: "/notices" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const footerExploreLinks: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "News", href: "/news" },
  { label: "Notices", href: "/notices" },
];

export const footerResourceLinks: NavItem[] = [
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Downloads", href: "/downloads" },
  { label: "Events", href: "/events" },
];
