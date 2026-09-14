/**
 * Intentional stand-in for official CVKM photography that has not been
 * supplied yet. Built entirely from CSS/SVG (no stock imagery) so the
 * layout reads as designed rather than broken while photography is
 * pending — swap for a real `next/image` once official photos arrive.
 */
export function PhotoPlaceholder({
  caption,
  tone = "navy",
  focal = "center",
  compact = false,
  className = "",
}: {
  caption: string;
  tone?: "navy" | "ivory";
  focal?: "center" | "top-right" | "bottom-left" | "top-left" | "bottom-right";
  /** Drops the "Photography pending" badge and tightens the caption for small tiles. */
  compact?: boolean;
  className?: string;
}) {
  const isNavy = tone === "navy";
  const focalPosition: Record<string, string> = {
    center: "50% 50%",
    "top-right": "82% 18%",
    "bottom-left": "18% 82%",
    "top-left": "18% 18%",
    "bottom-right": "82% 82%",
  };

  return (
    // Positioning (absolute inset-0, or relative+h-full/w-full) is supplied
    // entirely by `className` from the call site — this component only
    // establishes a containing block, via whichever position value that
    // resolves to, for its own absolutely-positioned decorative children.
    <div
      className={`overflow-hidden ${isNavy ? "bg-navy" : "bg-off-white"} ${className}`}
      role="img"
      aria-label={caption}
    >
      {/* Base tone */}
      <div
        className="absolute inset-0"
        style={{
          background: isNavy
            ? "linear-gradient(160deg, #0b3552 0%, #072238 60%, #051826 100%)"
            : "linear-gradient(160deg, #faf8f4 0%, #efe9dc 100%)",
        }}
      />

      {/* Fine dot texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(${isNavy ? "rgba(231,201,136,0.16)" : "rgba(11,53,82,0.12)"} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />

      {/* Concentric emblem-inspired rings */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g
          style={{
            transform: `translate(${focalPosition[focal].split(" ")[0]}, ${focalPosition[focal].split(" ")[1]})`,
          }}
        >
          {[220, 160, 100].map((r) => (
            <circle
              key={r}
              cx="0"
              cy="0"
              r={r}
              fill="none"
              stroke={isNavy ? "rgba(231,201,136,0.35)" : "rgba(11,53,82,0.18)"}
              strokeWidth={1}
            />
          ))}
        </g>
      </svg>

      {/* Directional grain line */}
      <div
        className="absolute inset-0"
        style={{
          background: isNavy
            ? "linear-gradient(115deg, transparent 40%, rgba(199,154,61,0.08) 50%, transparent 60%)"
            : "linear-gradient(115deg, transparent 40%, rgba(11,53,82,0.05) 50%, transparent 60%)",
        }}
      />

      <div className={`absolute inset-x-0 bottom-0 ${compact ? "p-3" : "flex items-end justify-between gap-4 p-4 sm:p-6"}`}>
        <span
          className={`block truncate text-[11px] font-semibold tracking-[0.16em] uppercase ${
            isNavy ? "text-gold-light/90" : "text-navy/70"
          }`}
        >
          {caption}
        </span>
        {!compact && (
          <span
            className={`shrink-0 border px-2 py-1 text-[10px] font-medium tracking-[0.1em] uppercase ${
              isNavy ? "border-white/25 text-white/60" : "border-navy/20 text-navy/50"
            }`}
          >
            Photography pending
          </span>
        )}
      </div>
    </div>
  );
}
