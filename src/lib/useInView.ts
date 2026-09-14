"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element first enters the viewport, then disconnects.
 *
 * Deliberately does NOT special-case prefers-reduced-motion here. An
 * earlier version tried to seed initial state from `matchMedia` via a
 * lazy useState initializer, but that reads differently during SSR
 * (no `window`) than on the client, and React does not reliably repaint
 * that className mismatch after hydration — reduced-motion users ended up
 * with content stuck at opacity 0 forever. The robust fix lives in CSS:
 * see the `@media (prefers-reduced-motion: reduce)` block in globals.css,
 * which forces the fully-visible end state unconditionally, independent of
 * this hook's state or any hydration timing.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = "0px 0px -5% 0px",
}: {
  threshold?: number;
  rootMargin?: string;
} = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
