import Image from "next/image";
import { site } from "@/data/site";

/**
 * References the single official logo asset (public/images/logo.jpg, a
 * 1:1 square image) used across the site. Every usage reads `site.logo`
 * from src/data/site.ts, so replacing that one file/path updates the whole
 * site — no other component needs to change. width/height are always kept
 * equal so the image's original aspect ratio is preserved unmodified.
 */
export function Logo({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src={site.logo}
      alt={site.logoAlt}
      width={size}
      height={size}
      priority
      className={`aspect-square object-contain ${className}`}
    />
  );
}
