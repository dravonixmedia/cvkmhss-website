import type { Metadata } from "next";
import Link from "next/link";
import { LandingHero } from "@/components/hero/LandingHero";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getPublishedNewsArticles } from "@/lib/news/public";
import { pageHeroes } from "@/data/pageHeroes";
import { staggerDelay } from "@/lib/stagger";

const title = "News";
const description = "Latest news and announcements from C V K M Higher Secondary School.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/news" });

const breadcrumb = [
  { label: "Home", href: "/" },
  { label: "News", href: "/news" },
];

export default async function NewsPage() {
  const newsArticles = await getPublishedNewsArticles();
  const [featured, ...rest] = newsArticles;

  return (
    <>
      <LandingHero hero={pageHeroes.news} breadcrumb={breadcrumb} />

      <section className="py-16 sm:py-20">
        <Container>
          {!featured ? (
            <Reveal variant="fadeUp">
              <EmptyState
                title="No news published yet"
                description="School announcements and news articles will appear here once published."
              />
            </Reveal>
          ) : (
            <div className="grid gap-14">
              <Reveal variant="fadeUp">
                <Link href={`/news/${featured.slug}`} className="group grid gap-8 lg:grid-cols-[1.3fr_1fr]">
                  <div className="relative h-64 sm:h-96">
                    <PhotoPlaceholder
                      caption={featured.title}
                      tone="navy"
                      focal="bottom-left"
                      className="absolute inset-0"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                      {featured.category}
                    </p>
                    <h2 className="font-heading mt-3 text-2xl font-semibold text-navy group-hover:underline sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate">{featured.summary}</p>
                    <time dateTime={featured.publishedDate} className="mt-4 text-xs text-slate">
                      {featured.publishedDate}
                    </time>
                  </div>
                </Link>
              </Reveal>

              {rest.length > 0 && (
                <div className="grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article, index) => (
                    <Reveal key={article.slug} variant="fadeUp" delay={100 + staggerDelay(index, 90)}>
                      <Link href={`/news/${article.slug}`} className="group block">
                        <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                          {article.category}
                        </p>
                        <h2 className="font-heading mt-2 text-lg font-semibold text-navy group-hover:underline">
                          {article.title}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate">{article.summary}</p>
                        <time dateTime={article.publishedDate} className="mt-3 block text-xs text-slate">
                          {article.publishedDate}
                        </time>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/news" })} />
    </>
  );
}
