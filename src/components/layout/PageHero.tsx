import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full border border-gold/20"
      />
      <Container className="relative py-16 sm:py-20">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">{eyebrow}</p>
        <h1 className="font-heading mt-4 max-w-2xl text-3xl font-bold sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">{description}</p>
        )}
      </Container>
    </section>
  );
}
