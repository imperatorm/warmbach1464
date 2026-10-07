"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sectionOrder, warmbachGallery, type GallerySection } from "@/lib/gallery";
import { scrollTo } from "@/lib/smoothScroll";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryLightbox, useLightbox } from "./GalleryLightbox";

/** The fixed header plus a breath, so a chapter never lands under the bar. */
const ANCHOR_OFFSET = -96;

const pad = (n: number) => String(n).padStart(2, "0");

const CHAPTERS = sectionOrder.map(({ key, label }, i) => ({
  key,
  label,
  no: pad(i + 1),
  id: `register-${key}`,
  items: warmbachGallery
    .map((img, index) => ({ ...img, index }))
    .filter((img) => img.section === key),
}));

/**
 * Das Register — the estate as a captioned index.
 *
 * The collection page rather than the feed: a table of contents stands at the
 * left and stays there while the four chapters pass on the right, and every
 * print carries a caption that says which part of the estate it shows and
 * where it sits in that set. The index always names the chapter under the
 * eye, and takes you to any other.
 *
 * Nothing here moves on its own, so there is nothing to fall back from: the
 * page is the same on touch, under reduced motion and on a fine pointer. On a
 * phone the index becomes the house's glass pill at the foot of the screen.
 *
 * After the captioned collection grids on Telescope and the portrait index on
 * Faculty Department (Mobbin).
 */
export function RegisterIndex() {
  const [index, setIndex] = useState<number | null>(null);
  const [active, setActive] = useState<GallerySection>(CHAPTERS[0].key);
  const [inView, setInView] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { open, close } = useLightbox(warmbachGallery, setIndex);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Which chapter is under the eye: the one crossing a band a third of the
    // way down the viewport. Chapters are tall, so one at a time is the rule.
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id.replace("register-", "") as GallerySection);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => spy.observe(s));

    // The pill at the foot of a phone screen steps aside once the index has
    // been scrolled past, so it never sits on the footer.
    const edge = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    edge.observe(wrap);

    return () => {
      spy.disconnect();
      edge.disconnect();
    };
  }, []);

  const jump = useCallback((id: string) => scrollTo(`#${id}`, ANCHOR_OFFSET), []);

  const marker = "text-[0.58rem] uppercase tracking-[0.22em]";

  return (
    <>
      {/* The right-hand padding at lg keeps the third column clear of the
          study rail (StudySwitch) until the screen is wide enough for both;
          the live gallery would carry px-10 alone. */}
      <div
        ref={wrapRef}
        className="mx-auto max-w-[1500px] px-6 pb-32 pt-28 lg:px-10 lg:pr-[9.5rem] lg:pt-36 min-[1800px]:pr-10"
      >
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-10">
          {/* The index — a column that stays while the chapters pass. */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className={`${marker} text-terrakotta`}>Galerie</p>
              <h1 className="t-hero mt-3 text-[clamp(1.8rem,3.2vw,2.6rem)] text-night">Der Warmbachhof</h1>
              <p className={`${marker} mt-2 text-night/60`}>
                <span className="tabular-nums">{warmbachGallery.length}</span> Aufnahmen
                <span className="mx-2 text-night/35">·</span>
                Kitzbühel
              </p>

              <nav aria-label="Bereiche des Hofs" className="mt-10 hidden lg:block">
                <ol className="border-t border-night/10">
                  {CHAPTERS.map((c) => {
                    const on = c.key === active;
                    return (
                      <li key={c.key} className="border-b border-night/10">
                        <a
                          href={`#${c.id}`}
                          data-cursor
                          aria-current={on ? "true" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            jump(c.id);
                          }}
                          className={`group flex min-h-12 items-baseline gap-4 py-3.5 transition-colors duration-300 ${
                            on ? "text-night" : "text-night/40 hover:text-night/75"
                          }`}
                        >
                          <span className={`${marker} w-10 shrink-0 ${on ? "text-terrakotta" : ""}`}>
                            ( {c.no} )
                          </span>
                          <span className="t-hero text-[1.35rem] leading-none">{c.label}</span>
                          <span className={`${marker} ml-auto tabular-nums`}>{pad(c.items.length)}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <p className="mt-10 hidden max-w-[16rem] text-[0.9rem] leading-relaxed text-night/60 lg:block">
                Hof, Bar, Brennerei und der kupferne Kothe-Kessel — am Osthang über Kitzbühel.
              </p>
            </div>
          </aside>

          {/* The chapters. */}
          <div className="mt-14 lg:col-span-9 lg:mt-0">
            {CHAPTERS.map((c) => (
              <section key={c.key} id={c.id} className="mb-24 scroll-mt-24 last:mb-0">
                <Reveal>
                  <header className="mb-8 flex items-baseline justify-between gap-6 border-b border-night/10 pb-4">
                    <h2 className="t-hero text-[clamp(1.5rem,2.6vw,2.2rem)] text-night">
                      <span className={`${marker} mr-3 align-middle text-terrakotta`}>( {c.no} )</span>
                      {c.label}
                    </h2>
                    <p className={`${marker} shrink-0 text-night/45`}>
                      <span className="tabular-nums">{pad(c.items.length)}</span> Aufnahmen
                    </p>
                  </header>
                </Reveal>

                <Reveal y={18}>
                  <div className="columns-2 gap-5 xl:columns-3">
                    {c.items.map((img, k) => (
                      <figure key={img.src} className="mb-7 break-inside-avoid">
                        <button
                          type="button"
                          data-cursor
                          onClick={(e) => open(img.index, e.currentTarget.querySelector("img"))}
                          aria-label={`${c.label} — Aufnahme ${k + 1} von ${c.items.length} öffnen`}
                          className="group block w-full overflow-hidden bg-kalk"
                        >
                          <Image
                            src={img.src}
                            width={img.width}
                            height={img.height}
                            sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 36vw, 24vw"
                            alt=""
                            className="h-auto w-full transition-transform duration-700 ease-deep group-hover:scale-[1.03]"
                          />
                        </button>
                        {/* What is true about this frame and nothing more. */}
                        <figcaption className={`${marker} mt-2.5 flex items-baseline justify-between gap-3`}>
                          <span className="text-night/70">{c.label}</span>
                          <span className="tabular-nums text-night/40">
                            {pad(k + 1)} / {pad(c.items.length)}
                          </span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </Reveal>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* On a phone the index is the house's glass pill, at the foot of the screen. */}
      <nav
        aria-label="Bereiche des Hofs"
        className={`fixed inset-x-4 bottom-5 z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 overflow-x-auto rounded-full border border-night/10 bg-cream/85 p-1 backdrop-blur-md transition-opacity duration-300 [scrollbar-width:none] lg:hidden ${
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
                on ? "bg-night text-cream" : "text-night/70 hover:text-night"
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
