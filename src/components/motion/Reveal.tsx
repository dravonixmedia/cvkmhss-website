"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/useInView";

export type RevealVariant =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "lineReveal"
  | "imageReveal";

const variantClass: Record<RevealVariant, string> = {
  fadeUp: "reveal--fade-up",
  fadeIn: "reveal--fade-in",
  slideLeft: "reveal--slide-left",
  slideRight: "reveal--slide-right",
  scaleIn: "reveal--scale-in",
  lineReveal: "reveal--line-reveal",
  imageReveal: "reveal--image-reveal",
};

interface RevealProps {
  children?: ReactNode;
  variant?: RevealVariant;
  /** Stagger offset in ms — pass index * step from a .map() for sequenced groups. */
  delay?: number;
  /** lineReveal only: grow vertically instead of horizontally. */
  vertical?: boolean;
  as?: "div" | "span" | "li" | "ul";
  className?: string;
  threshold?: number;
  "aria-hidden"?: boolean;
}

/**
 * Single reusable scroll-reveal primitive. Fires once per element via
 * IntersectionObserver (see useInView), animates only `opacity`/`transform`
 * (no layout properties, so no reflow), and collapses to an instant,
 * fully-visible state under prefers-reduced-motion. Compose staggered
 * groups by rendering several Reveal instances with incrementing `delay`
 * (see src/lib/stagger.ts) rather than a separate "staggerChildren" variant.
 */
export function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  vertical = false,
  as = "div",
  className = "",
  threshold,
  "aria-hidden": ariaHidden,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold });

  const classes = [
    "reveal",
    variantClass[variant],
    vertical ? "reveal--vertical" : "",
    inView ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  if (as === "li") {
    return (
      <li ref={ref as React.RefObject<HTMLLIElement>} className={classes} style={style} aria-hidden={ariaHidden}>
        {children}
      </li>
    );
  }
  if (as === "span") {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} className={classes} style={style} aria-hidden={ariaHidden}>
        {children}
      </span>
    );
  }
  if (as === "ul") {
    return (
      <ul ref={ref as React.RefObject<HTMLUListElement>} className={classes} style={style} aria-hidden={ariaHidden}>
        {children}
      </ul>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={classes} style={style} aria-hidden={ariaHidden}>
      {children}
    </div>
  );
}
