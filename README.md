# C V K M Higher Secondary School — Official Website

Official website for **C V K M Higher Secondary School** (CVKM HSS), East Kallada,
Kollam, Kerala, India — established 1926. This is the **Phase 1** build: a fast,
SEO/AEO/GEO-optimised public website with an architecture prepared for a
Phase 2 Supabase-backed admin dashboard.

## Content Policy

This codebase follows a strict rule: **no fabricated institutional content.**
Names, dates, statistics, achievements, contact details, admission
requirements, vision/mission text and similar facts are only included if they
were supplied and verified as part of the approved project brief. Anywhere
real content is not yet available, the UI renders a clearly labelled
**empty/placeholder state** ("coming soon", "pending confirmation", etc.)
instead of invented text. See `src/data/*.ts` for the single source of truth
for every verified fact used across the site — comments in each file explain
what may and may not be added.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router, React Server Components, Turbopack)
- TypeScript (strict mode)
- Tailwind CSS v4 (CSS-variable based theme, see `src/app/globals.css`)
- `next/image`, `next/font` (Inter + Manrope via `next/font/google`)
- [lucide-react](https://lucide.dev) icons
- ESLint (`eslint-config-next`)

## Development

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run lint     # ESLint
npm run build    # production build (also runs the TypeScript check)
npm run start    # serve the production build
```

## Folder Structure

```
src/
  app/                 Routes (App Router). One page.tsx per route + layout.tsx,
                        not-found.tsx, sitemap.ts, robots.ts, opengraph-image.tsx.
  components/
    layout/            Header, Footer, MobileNav, Breadcrumbs, PageHero
    home/               Homepage-only sections (Hero, Timeline, AtAGlance, …)
    ui/                 Generic reusable primitives (Button, Container, Faq, …)
    seo/                JsonLd injector
    achievements/, notices/, contact/   Page-specific interactive components
  data/                Typed content layer — the single source of truth for
                        every fact, nav item, category list and FAQ answer.
  lib/                 metadata.ts (Metadata API helper), schema.ts (JSON-LD builders)
  types/               Shared TypeScript interfaces for all content shapes
public/
  images/              Static assets, including the logo (see below)
```

## Brand Assets

`public/images/logo.jpg` is the **official school logo**, used unmodified
(not redrawn, recoloured, cropped or recreated) exactly as supplied by the
school. It is a square (1:1) image, so every component that renders it keeps
`width` and `height` equal to preserve its original proportions.

**Single source of truth:** `src/data/site.ts` exports `site.logo` as
`/images/logo.jpg`. Every usage of the logo across the site (header, footer,
JSON-LD `logo` field, Open Graph image) reads from that one config value —
to swap in a different file later, add it under `public/images/` and update
that one path; no other file needs to change.

## Content Architecture

All facts, copy fragments and category lists live in `src/data/*.ts`,
typed against `src/types/index.ts`. Components read from this layer and
never hardcode duplicate values. This is intentional groundwork for
**Phase 2**: swapping a `src/data/*.ts` array for a Supabase query should be
a mechanical, page-by-page change, not a rewrite.

Content that is genuinely empty right now (news, events, notices,
achievements, gallery albums, downloads) ships as typed empty arrays with
helper functions (`getUpcomingEvents`, `getImportantNotices`, etc.) already
in place — the UI components already know how to render both the populated
and empty states.

## SEO / AEO / GEO

- **Metadata**: every route sets a unique title/description via
  `buildMetadata()` (`src/lib/metadata.ts`), which also sets the canonical
  URL, Open Graph and Twitter Card metadata. A dynamic 1200×630 Open Graph
  image is generated at `src/app/opengraph-image.tsx` using `next/og` as a
  fallback until a dedicated social share image is supplied.
- **Structured data (JSON-LD)**: `src/lib/schema.ts` exposes builders for
  `School`/`EducationalOrganization`, `WebSite`, `WebPage`, `BreadcrumbList`,
  `FAQPage`, `NewsArticle` and `Event`, all populated only from verified
  fields in `src/data/site.ts`.
- **Sitemap & robots**: `src/app/sitemap.ts` and `src/app/robots.ts` (Next.js
  file conventions, served at `/sitemap.xml` and `/robots.txt`).
- **Breadcrumbs**: every interior page renders a visible breadcrumb trail
  (`src/components/layout/Breadcrumbs.tsx`) with matching `BreadcrumbList`
  JSON-LD.
- **AEO/GEO**: key facts (who/what/where/when/what-it-offers) are written as
  plain, crawlable HTML text — not locked inside images or sliders — and an
  FAQ system (`src/components/ui/Faq.tsx` + `src/data/faq.ts`) answers the
  direct questions prospective parents, students and AI answer engines are
  likely to ask, with matching `FAQPage` JSON-LD. Entity naming is kept
  consistent throughout: **C V K M Higher Secondary School** (full name) and
  **CVKM HSS** (alternate/short name).

## Accessibility & Performance

- Semantic landmarks, heading hierarchy, a skip-to-content link, visible
  focus states, and `prefers-reduced-motion` handling (`src/app/globals.css`).
- The mobile navigation drawer is rendered via a React portal into
  `document.body` — the header uses `backdrop-blur`, which (like `transform`)
  creates a CSS containing block for `position: fixed` descendants, so
  without the portal the drawer would be trapped inside the header's own
  bounding box instead of covering the viewport.
- Mostly server components; the few client components are small and
  isolated (mobile nav, achievements/notices filters, contact form).
- Images go through `next/image`; headings/fonts through `next/font`.

## Future Work (Phase 2 — not built yet, per project brief)

- **Supabase**: Postgres tables mirroring the shapes in `src/types/index.ts`,
  Supabase Auth for staff login, Supabase Storage for images/PDFs, and Row
  Level Security so only authenticated staff can write.
- **Admin dashboard**: a secured area for school staff to manage News,
  Events, Achievements, Gallery, Notices and Downloads, publishing directly
  to the database so the public site updates automatically.
- **Contact form & enquiry submission**: the Contact page form
  (`src/components/contact/EnquiryForm.tsx`) is UI-only by design — it does
  not submit anywhere yet. Wiring it to Supabase/email is Phase 2 work.
- **Google Maps embed**: the Contact page reserves a clearly labelled map
  area; it is intentionally left unembedded until a verified address and
  coordinates are supplied — see "Placeholder / Unverified Content" below.
- Other approved-but-deferred ideas the architecture does not block: Online
  Admission, a Student/Parent Portal, an Alumni section, Online Payments,
  Results/Examination information, an advanced Event Calendar.

## Placeholder / Unverified Content Still Needed From the School

The following are intentionally **not** invented and need to be supplied
before Phase 1 can be considered content-complete:

- Phone number, email address, exact street address/PIN code, and verified
  GPS coordinates or Google Maps link (`src/data/site.ts`)
- Management/leadership names, and official Vision/Mission/Values statements
  (`src/app/about/page.tsx`)
- Any real News articles, Notices, Events, Achievements, Gallery photography
  and Downloadable documents (`src/data/news.ts`, `notices.ts`, `events.ts`,
  `achievements.ts`, `gallery.ts`, `downloads.ts`)
- Admission guidelines, important dates and required documents
  (`src/app/admissions/page.tsx`)
- Social media profile URLs (`site.socialLinks` in `src/data/site.ts`)

## Deployment

Any standard Next.js host (Vercel, etc.) works out of the box — there are no
required environment variables in Phase 1. `site.url` in `src/data/site.ts`
should be updated to the production domain before launch, since it feeds
canonical URLs, JSON-LD and the sitemap.
