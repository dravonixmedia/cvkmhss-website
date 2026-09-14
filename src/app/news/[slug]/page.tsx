import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { newsArticleSchema, webPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getNewsBySlug, getRelatedNews, newsArticles } from "@/data/news";

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    image: article.featuredImage,
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedNews(article.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: article.title, href: `/news/${article.slug}` },
        ]}
      />

      <article className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal variant="fadeUp" as="div">
            <header>
              <p className="text-xs font-semibold tracking-wide text-gold uppercase">
                {article.category}
              </p>
              <h1 className="font-heading mt-3 text-3xl font-bold text-navy sm:text-4xl">
                {article.title}
              </h1>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate">
                <time dateTime={article.publishedDate}>Published {article.publishedDate}</time>
                {article.updatedDate && (
                  <time dateTime={article.updatedDate}>Updated {article.updatedDate}</time>
                )}
                {article.author && <span>By {article.author}</span>}
              </div>
            </header>
          </Reveal>

          <Reveal variant="fadeUp" delay={100} as="div" className="prose prose-slate mt-10 max-w-none">
            {article.body.map((paragraph, index) => (
              <p key={index} className="mb-4 text-base leading-relaxed text-charcoal">
                {paragraph}
              </p>
            ))}
          </Reveal>

          {related.length > 0 && (
            <footer className="mt-16 border-t border-border pt-10">
              <h2 className="font-heading text-lg font-semibold text-navy">Related News</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-sm font-medium text-navy hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </Container>
      </article>

      <JsonLd
        data={[
          newsArticleSchema(article),
          webPageSchema({ title: article.title, description: article.summary, path: `/news/${article.slug}` }),
        ]}
      />
    </>
  );
}
