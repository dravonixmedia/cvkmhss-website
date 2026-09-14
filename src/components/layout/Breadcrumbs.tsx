import Link from "next/link";
import type { BreadcrumbItem } from "@/types";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Container } from "@/components/ui/Container";

/**
 * Renders visible breadcrumb HTML (for SEO/AEO) plus matching BreadcrumbList
 * JSON-LD. `embedded` drops the standalone wrapper so it can be composed
 * directly inside a LandingHero; `tone` controls contrast against the
 * hero's background (photo/navy vs plain paper).
 */
export function Breadcrumbs({
  items,
  tone = "dark",
  embedded = false,
}: {
  items: BreadcrumbItem[];
  tone?: "dark" | "light";
  embedded?: boolean;
}) {
  const isLight = tone === "light";

  const list = (
    <ol
      className={`flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold tracking-[0.18em] uppercase ${
        isLight ? "text-white/70" : "text-slate"
      }`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.href} className="flex items-center gap-2.5">
            {index > 0 && <span aria-hidden>/</span>}
            {isLast ? (
              <span aria-current="page" className={isLight ? "text-gold-light" : "text-navy"}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={isLight ? "hover:text-white" : "hover:text-navy"}
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );

  if (embedded) {
    return (
      <nav aria-label="Breadcrumb">
        {list}
        <JsonLd data={breadcrumbSchema(items)} />
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-paper">
      <Container className="py-3">{list}</Container>
      <JsonLd data={breadcrumbSchema(items)} />
    </nav>
  );
}
