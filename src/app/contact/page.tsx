import type { Metadata } from "next";
import { MapPin, Mail, Phone } from "lucide-react";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getPublicSiteInfo } from "@/lib/settings/public";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { pageHeroes } from "@/data/pageHeroes";

const title = "Contact";
const description = "Contact C V K M Higher Secondary School, East Kallada, Kollam, Kerala.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/contact" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

export default async function ContactPage() {
  const info = await getPublicSiteInfo();

  return (
    <>
      <LandingHero hero={pageHeroes.contact} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-2">
          <Reveal variant="slideRight">
            <SectionHeading eyebrow="School Office" title="Contact Information" />
            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span className="text-sm leading-relaxed text-charcoal">
                  {info.name}
                  <br />
                  {info.address.locality}, {info.address.region}
                  <br />
                  {info.address.state}, {info.address.country}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span className="text-sm text-charcoal">
                  {info.contact.phone ?? "Phone number to be published"}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span className="text-sm text-charcoal">
                  {info.contact.email ?? "Email address to be published"}
                </span>
              </li>
            </ul>

            <div className="mt-10">
              <h3 className="font-heading text-sm font-semibold tracking-wide text-navy uppercase">
                Location
              </h3>
              {info.contact.googleMapsUrl ? (
                <a
                  href={info.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex aspect-video w-full flex-col items-center justify-center gap-2 border border-border bg-paper text-center transition hover:border-gold"
                >
                  <MapPin className="h-6 w-6 text-gold" aria-hidden />
                  <p className="text-sm font-medium text-charcoal">
                    {info.address.locality}, {info.address.region}, {info.address.state}
                  </p>
                  <p className="text-xs font-medium text-navy underline">Open in Google Maps</p>
                </a>
              ) : (
                <div className="mt-3 flex aspect-video w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-paper text-center">
                  <MapPin className="h-6 w-6 text-gold" aria-hidden />
                  <p className="text-sm font-medium text-charcoal">
                    {info.address.locality}, {info.address.region}, {info.address.state}
                  </p>
                  <p className="max-w-xs text-xs text-slate">
                    An interactive map will be embedded here once the verified location is confirmed.
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal variant="slideLeft" delay={100}>
            <SectionHeading eyebrow="Enquiry" title="Send an Enquiry" />
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </Reveal>
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/contact" })} />
    </>
  );
}
