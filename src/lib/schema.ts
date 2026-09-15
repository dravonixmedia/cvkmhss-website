import { site } from "@/data/site";
import type { BreadcrumbItem, EventItem, FaqCategory, NewsArticle } from "@/types";

/** Reusable EducationalOrganization/School JSON-LD, built only from verified fields. */
export function schoolSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["School", "EducationalOrganization"],
    name: site.name,
    alternateName: site.alternateName,
    url: site.url,
    logo: new URL(site.logo, site.url).toString(),
    description: site.description,
    foundingDate: String(site.foundingYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.state,
      addressCountry: site.address.country,
    },
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.socialLinks.length
      ? { sameAs: site.socialLinks.map((link) => link.url) }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.alternateName,
    url: site.url,
    inLanguage: "en-IN",
  };
}

export function webPageSchema(options: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    url: new URL(options.path, site.url).toString(),
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, site.url).toString(),
    })),
  };
}

export function faqSchema(categories: FaqCategory[]) {
  const items = categories.flatMap((category) => category.items);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function newsArticleSchema(article: NewsArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate ?? article.publishedDate,
    ...(article.featuredImage
      ? { image: [new URL(article.featuredImage, site.url).toString()] }
      : {}),
    ...(article.author ? { author: { "@type": "Person", name: article.author } } : {}),
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: new URL(site.logo, site.url).toString(),
      },
    },
    mainEntityOfPage: new URL(`/news/${article.slug}`, site.url).toString(),
  };
}

/**
 * Person JSON-LD for a published Management & Leadership member. Only
 * ever called with real, published Supabase data — never fabricated
 * facts (see src/app/about/page.tsx).
 */
export function personSchema(member: { full_name: string; designation: string; short_bio?: string | null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.full_name,
    jobTitle: member.designation,
    worksFor: { "@type": "Organization", name: site.name },
    ...(member.short_bio ? { description: member.short_bio } : {}),
  };
}

export function eventSchema(event: EventItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startTime ? `${event.date}T${event.startTime}` : event.date,
    ...(event.endTime ? { endDate: `${event.date}T${event.endTime}` } : {}),
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.address.locality,
        addressRegion: site.address.state,
        addressCountry: site.address.country,
      },
    },
    description: event.description,
    organizer: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
  };
}
