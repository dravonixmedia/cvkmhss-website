import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { primaryNav } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <Logo size={44} className="shrink-0" />
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="block truncate font-heading text-base font-bold text-navy">
              {site.shortName}
            </span>
            <span className="block truncate text-xs text-slate">
              {site.address.locality}, {site.address.region}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden shrink-0 lg:block">
          <ul className="flex items-center gap-0.5 whitespace-nowrap">
            {primaryNav.map((item) => (
              <li key={item.href} className="group relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-sm px-2.5 py-2 text-sm font-medium text-charcoal hover:text-navy focus-visible:text-navy xl:px-3"
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <div className="invisible absolute left-0 z-10 min-w-44 translate-y-1 rounded-sm border border-border bg-paper py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-charcoal hover:bg-off-white hover:text-navy"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-sm px-2.5 py-2 text-sm font-medium text-charcoal hover:text-navy xl:px-3"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Link
            href="/admissions"
            className="inline-flex items-center justify-center rounded-sm bg-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition-colors hover:bg-navy-dark"
          >
            Admissions
          </Link>
        </div>

        <MobileNav items={primaryNav} />
      </div>
    </header>
  );
}
