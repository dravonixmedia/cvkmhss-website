import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { newsArticles } from "@/data/news";

const title = "News";
const description = "Latest news and announcements from C V K M Higher Secondary School.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/news" });

export default function NewsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }]} />
      <PageHero eyebrow="News" title="Latest from CVKM" />

      <section className="py-16 sm:py-20">
        <Container>
          {newsArticles.length === 0 ? (
            <EmptyState
              title="No news published yet"
              description="School announcements and news articles will appear here once published."
            />
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {newsArticles.map((article) => (
                <Link key={article.slug} href={`/news/${article.slug}`} className="group block">
                  <p className="text-xs font-semibold tracking-wide text-gold uppercase">
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
              ))}
            </div>
          )}
        </Container>
      </section>

      <JsonLd data={webPageSchema({ title, description, path: "/news" })} />
    </>
  );
}
