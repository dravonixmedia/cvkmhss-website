import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { site } from "@/data/site";
import { footerExploreLinks, footerResourceLinks } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t-[3px] border-gold bg-navy text-white/90">
      <span
        aria-hidden
        className="font-heading pointer-events-none absolute -top-10 right-0 text-[11rem] leading-none font-bold text-white/[0.06] select-none sm:text-[15rem]"
      >
        {site.foundingYear}
      </span>

      <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Logo size={52} className="bg-white p-1" />
            <span className="font-heading text-lg font-bold text-white">{site.shortName}</span>
          </Link>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            {site.name}
            <br />
            {site.address.locality}
            <br />
            {site.address.region}, {site.address.state}
            <br />
            {site.address.country}
          </p>
          <p className="mt-5 text-xs tracking-[0.2em] text-gold uppercase">
            Est. {site.foundingYear}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {footerExploreLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/65 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Resources</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {footerResourceLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/65 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm text-white/65">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>
                {site.address.locality}, {site.address.region}, {site.address.state}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>{site.contact.phone ?? "Phone to be published"}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
              <span>{site.contact.email ?? "Email to be published"}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
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
