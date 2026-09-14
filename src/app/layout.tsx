import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { schoolSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.shortName} East Kallada`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "C V K M Higher Secondary School",
    "CVKM Higher Secondary School",
    "CVKM HSS",
    "CVKM HSS East Kallada",
    "CVKM School East Kallada",
    "CVKM School Kollam",
    "Higher Secondary School East Kallada",
    "School in East Kallada",
    "School in Kollam",
  ],
  authors: [{ name: site.name }],
  icons: {
    icon: site.logo,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-off-white text-charcoal">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd data={[schoolSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
