"use client";

import { useLayoutEffect, useRef, useState } from "react";

const LETTERS = "WARMBACH".split("");
const DIGITS = "1464".split("");
/** Numeral tracking, as a fraction of its font size (kept as the numeral scales). */
const TRACK = 0.12;

/**
 * "1464 / by / WARMBACH" — WARMBACH sets the measure at its own size; the
 * numeral is scaled so its *ink* spans exactly the same width, so the 1
 * starts where the W starts and the last 4 ends where the H ends.
 *
 * Box edges are not ink edges: letter-spacing leaves trailing space after
 * the last glyph, and every glyph has its own side bearings, so two rows
 * with identical boxes can still look offset. Advances come from the
 * rendered spans (exactly what the browser lays out); only the side bearings
 * of the four edge glyphs come from canvas text metrics. Everything scales
 * linearly with font size, so one measurement fits in a single step.
 */
export function WarmbachLockup() {
  const colRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLParagraphElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const [fit, setFit] = useState<{ fontSize: number; marginLeft: number } | null>(null);

  useLayoutEffect(() => {
    const col = colRef.current;
    const num = numRef.current;
    const word = wordRef.current;
    if (!col || !num || !word) return;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return;

    // Horizontal ink extents of one glyph, relative to its pen origin.
    const bearings = (el: HTMLElement, ch: string) => {
      const cs = getComputedStyle(el);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = ctx.measureText(ch);
      return { left: m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight };
    };

    const measure = () => {
      const ws = [...word.children] as HTMLElement[];
      const ns = [...num.children] as HTMLElement[];
      if (ws.length !== LETTERS.length || ns.length !== DIGITS.length) return;
      const colLeft = col.getBoundingClientRect().left;

      // WARMBACH ink, at its natural size.
      const w0 = ws[0].getBoundingClientRect();
      const wN = ws[ws.length - 1].getBoundingClientRect();
      const inkLeft = w0.left - colLeft - bearings(word, LETTERS[0]).left;
      const inkRight = wN.left - colLeft + bearings(word, LETTERS[LETTERS.length - 1]).right;
      const target = inkRight - inkLeft;
      if (target <= 0) return;

      // 1464 ink width at its current size F0 (advances + gaps + edge bearings).
      const f0 = parseFloat(getComputedStyle(num).fontSize);
      if (!f0) return;
      const advances = ns.slice(0, -1).reduce((s, el) => s + el.getBoundingClientRect().width, 0);
      const b1 = bearings(num, DIGITS[0]).left;
      const b4 = bearings(num, DIGITS[DIGITS.length - 1]).right;
      const ink0 = advances + (DIGITS.length - 1) * TRACK * f0 + b1 + b4;
      if (ink0 <= 0) return;

      const scale = target / ink0;
      const fontSize = f0 * scale;
      // Pen origin of the "1" sits right of the ink edge by its left bearing.
      const marginLeft = inkLeft + b1 * scale;

      setFit((prev) =>
        prev && Math.abs(prev.fontSize - fontSize) < 0.05 && Math.abs(prev.marginLeft - marginLeft) < 0.05
          ? prev
          : { fontSize, marginLeft },
      );
    };

    measure();
    // The word's size follows the viewport (its clamp); refit whenever it moves.
    const ro = new ResizeObserver(measure);
    ro.observe(word);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={colRef} className="relative flex w-fit flex-col items-start">
      <p
        ref={numRef}
        aria-hidden
        className="t-poster flex whitespace-nowrap text-[clamp(4rem,min(15vw,20svh),19.95rem)] !leading-[0.8] text-cream opacity-70 mix-blend-soft-light [font-variant-numeric:lining-nums]"
        style={
          fit
            ? { fontSize: `${fit.fontSize}px`, gap: `${TRACK * fit.fontSize}px`, marginLeft: `${fit.marginLeft}px` }
            : { gap: `${TRACK}em` }
        }
      >
        {DIGITS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </p>

      <p className="mt-[clamp(0.6rem,min(1.4vw,2.2svh),1.9rem)] self-stretch text-center font-body text-[clamp(0.6rem,0.9vw,0.95rem)] uppercase tracking-[0.28em] text-cream/75 [text-indent:0.28em]">
        by
      </p>

      <h2
        ref={wordRef}
        aria-label="WARMBACH"
        className="mt-[clamp(0.5rem,1vw,1.25rem)] flex font-display text-[clamp(2rem,min(5.6vw,8svh),7.5rem)] leading-none text-cream"
      >
        {LETTERS.map((ch, i) => (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ))}
      </h2>
    </div>
  );
}
