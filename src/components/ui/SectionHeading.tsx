export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** "dark" = navy text for light backgrounds, "light" = white text for dark backgrounds */
  tone?: "dark" | "light";
}) {
  const titleClass = tone === "light" ? "text-white" : "text-navy";
  const descriptionClass = tone === "light" ? "text-white/70" : "text-slate";

  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className={`font-heading text-3xl font-bold sm:text-4xl ${titleClass}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${descriptionClass}`}>{description}</p>
      )}
    </div>
  );
}
