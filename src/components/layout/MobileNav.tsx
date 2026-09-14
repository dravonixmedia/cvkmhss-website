"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import type { NavItem } from "@/types";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/data/site";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = open && (
    // Rendered via portal into document.body: the header uses backdrop-blur,
    // which (like a transform) creates a containing block for fixed-position
    // descendants — without the portal this overlay would be trapped inside
    // the header's own bounding box instead of covering the viewport.
    <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-navy-dark/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <Logo size={32} />
                <span className="font-heading text-sm font-bold text-navy">{site.shortName}</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center border border-border text-navy"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-4">
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href} className="border-b border-border/70 last:border-none">
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded(expanded === item.label ? null : item.label)
                          }
                          aria-expanded={expanded === item.label}
                          className="flex w-full items-center justify-between px-2 py-3 text-left text-sm font-medium text-charcoal"
                        >
                          {item.label}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expanded === item.label ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>
                        {expanded === item.label && (
                          <ul className="pb-2 pl-4">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  className="block px-2 py-2 text-sm text-slate hover:text-navy"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-2 py-3 text-sm font-medium text-charcoal hover:text-navy"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-border p-4">
              <Link
                href="/admissions"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center border border-navy bg-navy px-4 py-3 text-xs font-semibold tracking-[0.14em] text-white uppercase"
              >
                Admissions
              </Link>
            </div>
          </div>
        </div>
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center border border-border text-navy"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {drawer && typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </div>
  );
}
