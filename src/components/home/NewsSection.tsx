import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { newsArticles } from "@/data/news";

export function NewsSection() {
  return (
    <section className="border-y border-border bg-paper py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="News" title="Latest from CVKM" />
          <Link
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
          >
            View all news <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10">
          {newsArticles.length === 0 ? (
            <EmptyState
              title="No news published yet"
              description="Announcements and school news will appear here once published."
            />
          ) : (
            <div className="grid gap-8 sm:grid-cols-3">
              {newsArticles.slice(0, 3).map((article) => (
                <Link key={article.slug} href={`/news/${article.slug}`} className="group block">
                  <p className="text-xs font-semibold tracking-wide text-gold uppercase">
                    {article.category}
                  </p>
                  <h3 className="font-heading mt-2 text-lg font-semibold text-navy group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{article.summary}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
