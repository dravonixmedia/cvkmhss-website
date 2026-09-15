import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { getPublishedNewsArticles } from "@/lib/news/public";
import { staggerDelay } from "@/lib/stagger";

export async function NewsSection() {
  const newsArticles = await getPublishedNewsArticles();
  const [featured, ...rest] = newsArticles;
  const supporting = rest.slice(0, 2);

  return (
    <section className="border-y border-border bg-paper py-20 sm:py-24">
      <Container>
        <Reveal variant="fadeUp">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="News" title="Latest from CVKM" />
            <Link
              href="/news"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold"
            >
              View all news <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10">
          {!featured ? (
            <Reveal variant="fadeUp" delay={80}>
              <EmptyState
                title="No news published yet"
                description="Announcements and school news will appear here once published."
              />
            </Reveal>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <Reveal variant="fadeUp">
                <Link href={`/news/${featured.slug}`} className="group block">
                  <div className="relative h-64 sm:h-80">
                    {featured.featuredImage ? (
                      <Image
                        src={featured.featuredImage}
                        alt={featured.title}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="object-cover object-center"
                      />
                    ) : (
                      <PhotoPlaceholder
                        caption={featured.title}
                        tone="navy"
                        focal="bottom-left"
                        className="absolute inset-0"
                      />
                    )}
                  </div>
                  <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                    {featured.category}
                  </p>
                  <h3 className="font-heading mt-2 text-2xl font-semibold text-navy group-hover:underline">
                    {featured.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate">
                    {featured.summary}
                  </p>
                </Link>
              </Reveal>

              <div className="divide-y divide-border border-t border-border lg:border-t-0 lg:border-l lg:pl-10">
                {supporting.map((article, index) => (
                  <Reveal
                    key={article.slug}
                    variant="fadeUp"
                    delay={140 + staggerDelay(index, 90)}
                    className={`py-6 ${index === 0 ? "pt-0" : ""}`}
                  >
                    <Link href={`/news/${article.slug}`} className="group block">
                      <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">
                        {article.category}
                      </p>
                      <h3 className="font-heading mt-2 text-lg font-semibold text-navy group-hover:underline">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate">{article.summary}</p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
