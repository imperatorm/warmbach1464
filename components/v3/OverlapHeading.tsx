import { ParallaxImage } from "./ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Mirage's "about us" hero: a giant lowercase italic serif headline set on the
 * cream sheet, its baseline overlapping the full-bleed image below it.
 */
export function OverlapHeading({
  word,
  image,
  kicker,
  children,
}: {
  word: string;
  image: { src: string; alt: string };
  kicker?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative bg-cream pt-28 text-night lg:pt-36">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        {kicker && (
          <Reveal>
            <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-copper">{kicker}</p>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="-mb-[0.34em] font-display text-[clamp(4.2rem,15vw,12.5rem)] lowercase italic leading-[0.9] tracking-[-0.02em] text-merlot [text-shadow:0_2px_30px_rgba(240,239,235,0.25)]">
            {word}
          </h1>
        </Reveal>
      </div>
      <ParallaxImage src={image.src} alt={image.alt} className="h-[46svh] w-full lg:h-[56svh]" sizes="100vw" priority />
      {children}
    </header>
  );
}
