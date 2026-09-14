import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { site } from "@/data/site";
import { footerQuickLinks, footerMoreLinks } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-navy text-white/90">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Logo size={48} className="rounded-sm bg-white p-1" />
            <span className="font-heading text-base font-bold text-white">{site.shortName}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {site.name}
            <br />
            {site.address.locality}
            <br />
            {site.address.region}, {site.address.state}
            <br />
            {site.address.country}
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-gold uppercase">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {footerQuickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-gold uppercase">
            More
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {footerMoreLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-gold uppercase">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>
                {site.address.locality}, {site.address.region}, {site.address.state}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>{site.contact.phone ?? "Phone to be published"}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>{site.contact.email ?? "Email to be published"}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Website crafted by{" "}
            <a
              href={site.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gold hover:text-gold-light"
            >
              {site.developer.name}
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
