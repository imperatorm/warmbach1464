"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sectionOrder, warmbachGallery, type GalleryImage, type GallerySection } from "@/lib/gallery";
import { scrollTo } from "@/lib/smoothScroll";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";

const pad = (n: number) => String(n).padStart(2, "0");

/** Pixels of night between tiles — grout, not gutter. */
const GAP = 3;

type Tile = GalleryImage & { index: number; ratio: number };
type Row = { tiles: Tile[]; hFrac: number };

/**
 * Break a chapter's prints into rows that each fill the wall edge to edge.
 *
 * `units` is how many square widths fit across one row, so a row's target
 * height is 1/units of the wall's width; rows that hold a featured print aim
 * taller by `boost`, and no row may stand taller than `max` of the width.
 * Every possible set of breaks is weighed by how far its rows stray from
 * that target, and the cheapest wins — so a chapter never ends on one lonely
 * print, and no print is ever cropped: each tile keeps its own proportions
 * and the row's height falls out of the widths. Pure arithmetic on the image
 * ratios, identical on the server and in the browser.
 */
function justify(tiles: Tile[], units: number, boost: number, max: number): Row[] {
  const n = tiles.length;
  const target = 1 / units;
  const best: number[] = new Array(n + 1).fill(Infinity);
  const brk: number[] = new Array(n + 1).fill(0);
  best[0] = 0;

  for (let j = 1; j <= n; j += 1) {
    let sum = 0;
    let featured = false;
    for (let i = j - 1; i >= 0; i -= 1) {
      sum += tiles[i].ratio;
      featured ||= tiles[i].featured;
      const h = 1 / sum;
      const t = target * (featured ? boost : 1);
      // A row past the cap is not forbidden, only made very expensive — a
      // chapter of two prints still has to be laid out somehow.
      const over = Math.max(0, h - max);
      const cost = best[i] + (h - t) * (h - t) + over * over * 40;
      if (cost < best[j]) {
        best[j] = cost;
        brk[j] = i;
      }
    }
  }

  const rows: Row[] = [];
  for (let j = n; j > 0; j = brk[j]) {
    const slice = tiles.slice(brk[j], j);
    rows.unshift({ tiles: slice, hFrac: 1 / slice.reduce((a, t) => a + t.ratio, 0) });
  }
  return rows;
}

/**
 * Three walls, one per width class, each laid out once and shown by CSS — so
 * the first paint is already the right wall for the screen and nothing
 * reflows on arrival. A phone takes one landscape or two portraits per row;
 * the wide wall takes four to five, and never a row taller than a screen.
 */
const WALLS = [
  { cls: "sm:hidden", units: 1.3, boost: 1, max: 1 },
  { cls: "hidden sm:block lg:hidden", units: 3, boost: 1.3, max: 0.55 },
  { cls: "hidden lg:block", units: 4.6, boost: 1.6, max: 0.38 },
] as const;

const CHAPTERS = sectionOrder.map(({ key, label }, i) => {
  const tiles: Tile[] = warmbachGallery
    .map((img, index) => ({ ...img, index, ratio: img.width / img.height }))
    .filter((t) => t.section === key);
  return {
    key,
    label,
    no: pad(i + 1),
    id: `mosaik-${key}`,
    tiles,
    walls: WALLS.map((w) => ({ ...w, rows: justify(tiles, w.units, w.boost, w.max) })),
  };
});

/**
 * Das Mosaik — the estate as one flush wall of photographs.
 *
 * No frames, no gutters, no margins: the prints are set edge to edge across
 * the full width of the screen with a hairline of night between them, each
 * chapter announced by its name at the scale the display face is built for.
 * Addressing a tile breathes it slightly and names it in a glass capsule; the
 * glass pill at the foot of the screen says which chapter you are standing
 * in and takes you to the others.
 *
 * The wall is laid out from the photographs' proportions alone, so it is the
 * same composition on every visit and needs nothing measured. Nothing here
 * moves on its own; there is no fallback because there is nothing to fall
 * back from.
 *
 * After the flush image walls on Visual Electric and Epidemic Sound, and
 * Klook's hotel mosaic (Mobbin).
 */
export function MosaikWall() {
  const [index, setIndex] = useState<number | null>(null);
  const [active, setActive] = useState<GallerySection>(CHAPTERS[0].key);
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { open, close } = useLightbox(warmbachGallery, setIndex);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id.replace("mosaik-", "") as GallerySection);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => spy.observe(s));
    const edge = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    edge.observe(wrap);
    return () => {
      spy.disconnect();
      edge.disconnect();
    };
  }, []);

  const jump = useCallback((id: string) => scrollTo(`#${id}`, -72), []);

  const marker = "text-[0.58rem] uppercase tracking-[0.24em]";

  return (
    <>
      <div ref={wrapRef} className="pb-20">
        <header className="px-6 pt-24 lg:px-10 lg:pt-28">
          <h1 className="t-hero text-[clamp(1.6rem,2.6vw,2.4rem)] text-cream">Der Warmbachhof</h1>
          <p className={`${marker} mt-2 text-cream/45`}>
            <span className="tabular-nums">{warmbachGallery.length}</span> Aufnahmen
            <span className="mx-2 text-cream/25">·</span>
            Kitzbühel
          </p>
        </header>

        {CHAPTERS.map((c) => (
          <section key={c.key} id={c.id} className="scroll-mt-[4.5rem]">
            <Reveal>
              <header className="px-6 pb-7 pt-16 lg:px-10 lg:pb-10 lg:pt-24">
                <p className={`${marker} text-gold`}>
                  ( {c.no} )
                  <span className="mx-2 text-cream/25">·</span>
                  <span className="tabular-nums text-cream/50">{pad(c.tiles.length)} Aufnahmen</span>
                </p>
                <h2 className="t-poster mt-3 uppercase text-[clamp(2.6rem,9vw,8rem)] text-cream">{c.label}</h2>
              </header>
            </Reveal>

            {c.walls.map((w) => (
              <div key={w.cls} className={w.cls}>
                {w.rows.map((row, ri) => (
                  <div key={ri} className="flex" style={{ gap: GAP, marginTop: ri ? GAP : 0 }}>
                    {row.tiles.map((t) => {
                      const share = t.ratio * row.hFrac;
                      const k = c.tiles.indexOf(t);
                      return (
                        <button
                          key={t.src}
                          type="button"
                          data-cursor
                          onClick={(e) => open(t.index, e.currentTarget.querySelector("img"))}
                          aria-label={`${c.label} — Aufnahme ${k + 1} von ${c.tiles.length} öffnen`}
                          className="group relative shrink-0 overflow-hidden bg-soot focus:outline-none focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
                          style={{
                            width: `calc((100% - ${(row.tiles.length - 1) * GAP}px) * ${share.toFixed(5)})`,
                            aspectRatio: `${t.width} / ${t.height}`,
                          }}
                        >
                          <Image
                            src={t.src}
                            alt=""
                            fill
                            sizes={`${Math.ceil(share * 100)}vw`}
                            className="object-cover transition-transform duration-700 ease-deep group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                          />
                          {/* Glass on the scene, naming the tile while it is addressed. */}
                          <span
                            aria-hidden
                            className={`${marker} pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-night/55 px-3 py-1.5 text-cream opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100`}
                          >
                            {c.label}
                            <span className="text-cream/40">·</span>
                            <span className="tabular-nums">{pad(k + 1)}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Which chapter you are standing in, and the way to the other three. */}
      <nav
        aria-label="Bereiche des Hofs"
        className={`fixed inset-x-4 bottom-5 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 overflow-x-auto rounded-full border border-cream/15 bg-night/70 p-1 backdrop-blur-md transition-opacity duration-300 [scrollbar-width:none] ${
          inView ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {CHAPTERS.map((c) => {
          const on = c.key === active;
          return (
            <button
              key={c.key}
              type="button"
              data-cursor
              onClick={() => jump(c.id)}
              aria-current={on ? "true" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                on ? "bg-cream text-night" : "text-cream/55 hover:text-cream"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </nav>

      <GalleryLightbox
        images={warmbachGallery}
        index={index}
        onClose={close}
        onPage={(d) =>
          setIndex((i) => (i === null ? i : (i + d + warmbachGallery.length) % warmbachGallery.length))
        }
      />
    </>
  );
}
