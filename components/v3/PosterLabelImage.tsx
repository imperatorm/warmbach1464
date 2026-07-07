import { ParallaxImage } from "./ParallaxImage";

/**
 * Fortress's offset framed image with a small vertical poster-label card
 * overlaid on one edge — the printed exhibition tag on a photograph.
 */
export function PosterLabelImage({
  src,
  alt,
  labelTop,
  labelBottom,
  caption,
  aspect = "aspect-[4/3]",
  labelSide = "right",
  className = "",
  sizes = "(min-width: 1024px) 56vw, 92vw",
}: {
  src: string;
  alt: string;
  labelTop: string;
  labelBottom: string;
  caption?: string;
  aspect?: string;
  labelSide?: "left" | "right";
  className?: string;
  sizes?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <ParallaxImage src={src} alt={alt} className={aspect} sizes={sizes} />
      {/* Vertical poster label riding the edge */}
      <div
        className={`absolute top-1/2 w-28 -translate-y-1/2 border border-night/15 bg-cream px-3 py-5 text-center shadow-[0_18px_50px_rgba(29,41,29,0.25)] sm:w-32 ${
          labelSide === "right" ? "-right-5 sm:-right-8" : "-left-5 sm:-left-8"
        }`}
      >
        <p className="text-[0.55rem] font-semibold uppercase leading-relaxed tracking-[0.22em] text-night/75">{labelTop}</p>
        <span aria-hidden className="mx-auto my-3 block h-px w-8 bg-copper/50" />
        <p className="font-display text-sm italic text-night">{labelBottom}</p>
      </div>
      {caption && (
        <figcaption className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-copper">{caption}</figcaption>
      )}
    </figure>
  );
}
