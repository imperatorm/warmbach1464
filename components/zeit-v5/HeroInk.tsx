"use client";

import { useEffect, useId, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * The flight's title, set in the open meadow of the first view.
 *
 * It behaves like wet paint. On arrival it paints in: the letters start as a
 * bled, blurred wash and draw together. On the first stretch of scroll it
 * flows out again: an SVG turbulence field displaces the glyphs further and
 * further, so the strokes run and smear like watercolour taking on too much
 * water, while each word drifts off at its own pace and the wash fades into
 * the meadow underneath. One number, `bleed`, drives all of it — the larger
 * of what is left of the intro and how far the reader has scrolled out.
 *
 * Reduced motion: no displacement, no drift; the title simply fades.
 */

const TITLE = ["562", "Jahre", "an", "einem", "Osthang."];
const KICKER = "Säule I · Zeit — ein Flug in sieben Stationen";
const SUB =
  "Von oben über das Land, hinunter durch den Bau des Hofs, zwischen die Bäume bis an den Apfel. Jedes Bild ist gemalt, jeder Satz steht in der Chronik.";

/** Scroll progress over which the title flows out. */
const OUT: [number, number] = [0.004, 0.07];

function Word({ text, i, out }: { text: string; i: number; out: MotionValue<number> }) {
  // alternate words run up and sideways at different rates, so the line comes apart rather than lifting as a block
  const y = useTransform(out, [0, 1], [0, -(26 + (i % 3) * 18)]);
  const x = useTransform(out, [0, 1], [0, (i % 2 === 0 ? -1 : 1) * (8 + i * 5)]);
  const rotate = useTransform(out, [0, 1], [0, (i % 2 === 0 ? -1 : 1) * 2.5]);
  return (
    <motion.span className="inline-block" style={{ y, x, rotate }}>
      {text}
      {i < TITLE.length - 1 ? " " : ""}
    </motion.span>
  );
}

export function HeroInk({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const id = `ink-${useId().replace(/:/g, "")}`;
  const turb = useRef<SVGFETurbulenceElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const blur = useRef<SVGFEGaussianBlurElement>(null);

  const intro = useMotionValue(reduce ? 0 : 1);
  useEffect(() => {
    if (reduce) return;
    const c = animate(intro, 0, { duration: 2.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [intro, reduce]);

  const out = useTransform(progress, OUT, [0, 1], { clamp: true });
  const bleed = useTransform([intro, out], ([a, b]) => Math.max(a as number, b as number));

  // The filter is driven imperatively: React never re-renders for it.
  const apply = (v: number) => {
    if (reduce) return;
    disp.current?.setAttribute("scale", String(v * 110));
    blur.current?.setAttribute("stdDeviation", String(v * 5));
    // the field itself loosens as it wets, so the run reads as flow, not jitter
    turb.current?.setAttribute("baseFrequency", `${(0.006 + v * 0.008).toFixed(4)} ${(0.018 + v * 0.03).toFixed(4)}`);
  };
  useMotionValueEvent(bleed, "change", apply);
  useEffect(() => apply(bleed.get()));

  const opacity = useTransform(bleed, [0, 0.35, 0.9], [1, 0.85, 0]);
  const subOpacity = useTransform(bleed, [0, 0.25, 0.7], [1, 0.7, 0]);
  const hidden = useTransform(out, (v) => (v >= 1 ? "hidden" : "visible"));

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pt-16"
      style={{ visibility: hidden }}
    >
      {!reduce && (
        <svg aria-hidden width="0" height="0" className="absolute">
          <filter id={id} x="-20%" y="-40%" width="140%" height="180%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.014 0.048" numOctaves={3} seed={7} result="noise" />
            <feDisplacementMap ref={disp} in="SourceGraphic" in2="noise" scale="110" xChannelSelector="R" yChannelSelector="G" result="run" />
            <feGaussianBlur ref={blur} in="run" stdDeviation="5" />
          </filter>
        </svg>
      )}

      <div className="relative max-w-3xl text-center" style={reduce ? undefined : { filter: `url(#${id})` }}>
        {/* a wash of the paper's own cream, so the line sits on the meadow like paint on a dried ground */}
        <div
          aria-hidden
          className="absolute -inset-x-16 -inset-y-14 rounded-[50%] bg-cream/70 blur-2xl"
        />
        <motion.div className="relative" style={{ opacity }}>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-terrakotta">{KICKER}</p>
          <h1 className="t-hero mt-5 text-[clamp(2.4rem,6vw,5rem)] leading-[1.02] text-night">
            {TITLE.map((w, i) => (
              <Word key={w} text={w} i={i} out={out} />
            ))}
          </h1>
        </motion.div>
        <motion.p
          className="relative mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-night/75"
          style={{ opacity: subOpacity }}
        >
          {SUB}
        </motion.p>
      </div>
    </motion.div>
  );
}
