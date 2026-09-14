import type { BreadcrumbItem, PageHeroConfig } from "@/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * One technical hero system, six visual compositions (see HeroVariant).
 * Every variant renders the same semantic core — a visible breadcrumb, an
 * eyebrow, exactly one <h1>, an optional description and CTAs — so SEO/AEO
 * signals stay identical regardless of which layout a page uses. Content
 * reveals in one consistent staggered sequence (breadcrumb → eyebrow → H1 →
 * description → CTA); the photo slot animates independently via its own
 * built-in imageReveal.
 */
export function LandingHero({
  hero,
  breadcrumb,
}: {
  hero: PageHeroConfig;
  breadcrumb: BreadcrumbItem[];
}) {
  const { eyebrow, title, description, variant, imageCaption, ctas, heritageMark, short } = hero;

  const eyebrowLight = (
    <p className="text-xs font-semibold tracking-[0.28em] text-gold-light uppercase">{eyebrow}</p>
  );
  const eyebrowDark = (
    <p className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">{eyebrow}</p>
  );

  // "ghost" (white-on-transparent) only reads on a dark/photo background;
  // on the light-background variants (split/editorial/collage) it's
  // remapped to "secondary" (navy-on-transparent) so it stays legible.
  function renderCtaRow(bg: "dark" | "light") {
    if (!ctas || ctas.length === 0) return null;
    return (
      <Reveal variant="fadeUp" delay={300}>
        <div className="mt-8 flex flex-wrap gap-4">
          {ctas.map((cta) => {
            const variant = bg === "light" && cta.variant === "ghost" ? "secondary" : (cta.variant ?? "gold");
            return (
              <Button key={cta.href} href={cta.href} variant={variant}>
                {cta.label}
              </Button>
            );
          })}
        </div>
      </Reveal>
    );
  }

  if (variant === "fullBleed" || variant === "lowerTitle") {
    const isLowerTitle = variant === "lowerTitle";
    const heightClass = short
      ? "min-h-[36vh] sm:min-h-[34vh] lg:min-h-[42vh]"
      : isLowerTitle
        ? "min-h-[50vh] sm:min-h-[46vh] lg:min-h-[56vh]"
        : "min-h-[58vh] sm:min-h-[52vh] lg:min-h-[68vh]";

    return (
      <section className={`relative flex items-end overflow-hidden ${heightClass}`}>
        <PhotoPlaceholder
          caption={imageCaption}
          tone="navy"
          focal={isLowerTitle ? "bottom-right" : "top-right"}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/35 to-transparent" />
        <Container className="relative z-10 pt-24 pb-10 text-white sm:pb-14">
          <Reveal variant="fadeIn">
            <Breadcrumbs items={breadcrumb} tone="light" embedded />
          </Reveal>
          <Reveal variant="fadeUp" delay={60} className="mt-6">
            {eyebrowLight}
          </Reveal>
          <Reveal variant="fadeUp" delay={140}>
            <h1 className="font-heading mt-4 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          </Reveal>
          {description && !isLowerTitle && (
            <Reveal variant="fadeUp" delay={220}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}
          {renderCtaRow("dark")}
        </Container>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="lg:grid lg:min-h-[62vh] lg:grid-cols-2">
        <div className="relative h-56 sm:h-72 lg:h-auto">
          <PhotoPlaceholder caption={imageCaption} tone="navy" focal="bottom-left" className="absolute inset-0" />
        </div>
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-0">
          <Reveal variant="fadeIn">
            <Breadcrumbs items={breadcrumb} tone="dark" embedded />
          </Reveal>
          <Reveal variant="fadeUp" delay={60} className="mt-6">
            {eyebrowDark}
          </Reveal>
          <Reveal variant="fadeUp" delay={140}>
            <h1 className="font-heading mt-4 max-w-lg text-4xl leading-[1.05] font-bold text-navy sm:text-5xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal variant="fadeUp" delay={220}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}
          {renderCtaRow("light")}
        </div>
      </section>
    );
  }

  if (variant === "editorial") {
    return (
      <section className="relative overflow-hidden bg-off-white">
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16 lg:py-28">
          <div className="relative">
            {heritageMark && (
              <Reveal
                as="span"
                variant="fadeUp"
                aria-hidden
                className="font-heading pointer-events-none absolute -top-10 -left-2 -z-10 text-[8rem] leading-none font-bold text-navy/[0.12] select-none sm:-top-16 sm:text-[11rem] lg:text-[13rem]"
              >
                {heritageMark}
              </Reveal>
            )}
            <Reveal variant="fadeIn">
              <Breadcrumbs items={breadcrumb} tone="dark" embedded />
            </Reveal>
            <Reveal variant="fadeUp" delay={60} className="mt-6">
              {eyebrowDark}
            </Reveal>
            <Reveal variant="fadeUp" delay={140}>
              <h1 className="font-heading mt-4 max-w-lg text-4xl leading-[1.05] font-bold text-navy sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal variant="fadeUp" delay={220}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-slate sm:text-lg">
                  {description}
                </p>
              </Reveal>
            )}
            {renderCtaRow("light")}
          </div>
          <div className="relative h-64 sm:h-80 lg:h-[28rem] lg:translate-y-10">
            <PhotoPlaceholder caption={imageCaption} tone="navy" focal="bottom-left" className="absolute inset-0" />
          </div>
        </Container>
      </section>
    );
  }

  if (variant === "overlay") {
    return (
      <section className="relative bg-off-white">
        <div className="relative h-[46vh] sm:h-[50vh] lg:h-[58vh]">
          <PhotoPlaceholder caption={imageCaption} tone="navy" focal="top-right" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 to-transparent" />
        </div>
        <Container>
          <div className="relative z-10 -mt-16 max-w-2xl bg-navy px-6 py-9 text-white sm:-mt-20 sm:px-10 sm:py-11">
            <Reveal variant="fadeIn">
              <Breadcrumbs items={breadcrumb} tone="light" embedded />
            </Reveal>
            <Reveal variant="fadeUp" delay={60} className="mt-6">
              {eyebrowLight}
            </Reveal>
            <Reveal variant="fadeUp" delay={140}>
              <h1 className="font-heading mt-4 text-3xl leading-[1.05] font-bold sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </Reveal>
            {description && (
              <Reveal variant="fadeUp" delay={220}>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                  {description}
                </p>
              </Reveal>
            )}
            {renderCtaRow("dark")}
          </div>
        </Container>
        <div className="h-10 sm:h-14" />
      </section>
    );
  }

  // collage
  return (
    <section className="bg-off-white">
      <Container className="py-14 sm:py-16 lg:py-20">
        <Reveal variant="fadeIn">
          <Breadcrumbs items={breadcrumb} tone="dark" embedded />
        </Reveal>
        <div className="mt-8 grid gap-3 sm:gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative h-64 sm:h-80 lg:h-[28rem]">
            <PhotoPlaceholder caption={imageCaption} tone="navy" focal="center" className="absolute inset-0" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2">
            <div className="relative h-32 sm:h-40 lg:h-auto">
              <PhotoPlaceholder caption="Student life" tone="ivory" focal="top-left" compact delay={120} className="absolute inset-0" />
            </div>
            <div className="relative h-32 sm:h-40 lg:h-auto">
              <PhotoPlaceholder caption="School activities" tone="navy" focal="bottom-right" compact delay={200} className="absolute inset-0" />
            </div>
          </div>
        </div>
        <div className="mt-8 max-w-2xl sm:mt-10">
          <Reveal variant="fadeUp" delay={60}>
            {eyebrowDark}
          </Reveal>
          <Reveal variant="fadeUp" delay={140}>
            <h1 className="font-heading mt-4 text-4xl leading-[1.05] font-bold text-navy sm:text-5xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal variant="fadeUp" delay={220}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate sm:text-lg">
                {description}
              </p>
            </Reveal>
          )}
          {renderCtaRow("light")}
        </div>
      </Container>
    </section>
  );
}
