import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { primaryNav } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/97 backdrop-blur">
      <div aria-hidden className="h-[3px] bg-gold" />
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <Logo size={42} className="shrink-0" />
          <span className="hidden min-w-0 leading-tight sm:block">
            <span className="font-heading block truncate text-[15px] font-bold tracking-wide text-navy">
              {site.shortName}
            </span>
            <span className="block truncate text-[11px] tracking-wide text-slate">
              {site.address.locality}, {site.address.region}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden shrink-0 lg:block">
          <ul className="flex items-center gap-1 whitespace-nowrap">
            {primaryNav.map((item) => (
              <li key={item.href} className="group relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="relative flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium tracking-wide text-charcoal after:absolute after:bottom-0.5 after:left-2.5 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-200 hover:text-navy hover:after:w-[calc(100%-1.25rem)] focus-visible:text-navy xl:px-3"
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <div className="invisible absolute left-0 z-10 min-w-44 translate-y-1 border border-border bg-paper py-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
                    className="relative block px-2.5 py-2 text-[13px] font-medium tracking-wide text-charcoal after:absolute after:bottom-0.5 after:left-2.5 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-200 hover:text-navy hover:after:w-[calc(100%-1.25rem)] xl:px-3"
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
            className="inline-flex items-center justify-center border border-navy bg-navy px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-navy-dark"
          >
            Admissions
          </Link>
        </div>

        <MobileNav items={primaryNav} />
      </div>
    </header>
  );
}
