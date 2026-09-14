import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-dark border border-navy",
  secondary:
    "bg-transparent text-navy border border-navy hover:bg-navy hover:text-white",
  ghost:
    "bg-transparent text-white border border-white/70 hover:bg-white/10",
  gold:
    "bg-gold text-navy border border-gold hover:bg-gold-light hover:border-gold-light",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide uppercase transition duration-200 ease-out hover:-translate-y-px ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
