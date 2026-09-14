import Image from "next/image";
import { site } from "@/data/site";

/**
 * References the single logo asset used across the site. Once the official
 * artwork is added at public/images/cvkm-hss-logo-placeholder.svg (or a new
 * file with `site.logo` updated in src/data/site.ts), every usage updates
 * automatically — no other component needs to change.
 */
export function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src={site.logo}
      alt={site.logoAlt}
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
