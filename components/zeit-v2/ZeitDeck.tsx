"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getLenis } from "@/lib/smoothScroll";
import { HourglassGlyph } from "@/components/v3/HourglassGlyph";
import { chapters, intro } from "./data";
import { ChronikChapter, HeuteChapter, HofChapter, StadtChapter, type ChapterHandle, type ChapterView } from "./chapters";

/**
 * Zeit v2 — the Longines "history" deck, in the house's own materials.
 *
 * A fixed title layer (the Hof's alpine footage) carries the active chapter's
 * headline; each chapter's content rises over it as a cream sheet and drops
 * away again to reveal the next title. The wheel is the page-turn:
 *
 *   title(0) → content(0) → title(1) → content(1) → … → content(3) → release
 *
 * A chapter that owns a horizontal rail gets first refusal on every wheel
 * event, so the rail runs to its end before the deck turns. Lenis stands down
 * while the deck owns scrolling and takes over again once the last sheet
 * releases the document to the footer.
 *
 * Below `lg`, on coarse pointers, or under reduced motion the same chapters
 * render as an ordinary stacked page — the deck is an enhancement, not the
 * only way in.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const HEADER = 77; // px — the fixed site header; the deck's chrome sits beneath it
const STEPS = chapters.length * 2;
const VIEWS: ChapterView[] = [HofChapter, ChronikChapter, StadtChapter, HeuteChapter];
const LABEL = "font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em]";

// React does not reflect `muted` into the SSR markup, so the browser's autoplay
// policy can see an unmuted video at load and refuse it. Mute imperatively,
// then ask again.
function startMutedVideo(el: HTMLVideoElement | null) {
  if (!el) return;
  el.muted = true;
  el.defaultMuted = true;
  el.play()?.catch(() => {});
}

function useDeckMode() {
  const reduce = useReducedMotion();
  const [deck, setDeck] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const apply = () => setDeck(mq.matches && !reduce);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [reduce]);
  return deck;
}

export function ZeitDeck() {
  return useDeckMode() ? <Deck /> : <Stacked />;
}

// ── The deck ──────────────────────────────────────────────────────────────────

function Deck() {
  const [step, setStep] = useState(0);
  const busy = useRef(false);
  const released = useRef(false);
  const wheelAcc = useRef(0);
  const touchY = useRef<number | null>(null);
  const chapterRef = useRef<ChapterHandle>(null);

  const chapter = Math.floor(step / 2);
  const phase: "title" | "content" = step % 2 === 0 ? "title" : "content";
  const c = chapters[chapter];
  const View = VIEWS[chapter];

  const lock = useCallback((on: boolean) => {
    document.documentElement.style.overflow = on ? "hidden" : "";
    const l = getLenis();
    if (on) l?.stop();
    else l?.start();
    released.current = !on;
  }, []);

  useEffect(() => {
    lock(true);
    return () => lock(false);
  }, [lock]);

  const go = useCallback((dir: 1 | -1) => {
    if (busy.current) return;
    setStep((s) => {
      const n = Math.min(STEPS - 1, Math.max(0, s + dir));
      if (n === s) return s;
      busy.current = true;
      window.setTimeout(() => (busy.current = false), 950);
      return n;
    });
  }, []);

  const jump = useCallback((i: number) => {
    if (busy.current) return;
    busy.current = true;
    window.setTimeout(() => (busy.current = false), 950);
    setStep(i * 2 + 1);
  }, []);

  // Wheel — the page-turn, after the chapter's own rail has had first refusal.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (released.current) {
        if (window.scrollY <= 0 && e.deltaY < 0) {
          e.preventDefault();
          lock(true);
        }
        return;
      }
      e.preventDefault();
      if (busy.current) return;
      if (phase === "content" && chapterRef.current?.consumeWheel(e.deltaY)) {
        wheelAcc.current = 0;
        return;
      }
      wheelAcc.current += e.deltaY;
      if (Math.abs(wheelAcc.current) < 60) return;
      const dir = wheelAcc.current > 0 ? 1 : -1;
      wheelAcc.current = 0;
      if (dir === 1 && step === STEPS - 1) {
        lock(false);
        return;
      }
      go(dir);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [phase, step, go, lock]);

  // Keys and touch.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (released.current) return;
      const inControl = (e.target as HTMLElement | null)?.closest?.("button, a, input, textarea, [role='slider']");
      if (e.key === " " && inControl) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        if (step === STEPS - 1) lock(false);
        else go(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      }
    };
    const onTouchStart = (e: TouchEvent) => (touchY.current = e.touches[0]?.clientY ?? null);
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current === null || released.current) return;
      const dy = (e.changedTouches[0]?.clientY ?? touchY.current) - touchY.current;
      touchY.current = null;
      if (Math.abs(dy) < 50) return;
      if (dy < 0 && step === STEPS - 1) lock(false);
      else go(dy < 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [step, go, lock]);

  const light = phase === "title";
  const nextIndex = phase === "title" ? chapter : chapter + 1;

  return (
    <div className="relative h-[100svh] overflow-hidden bg-night text-cream">
      <TitleLayer step={step} />

      <AnimatePresence>
        {phase === "content" && (
          <motion.section
            key={c.id}
            aria-labelledby={`zv2-${c.id}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="absolute inset-0 z-10 bg-cream text-night"
          >
            <h2 id={`zv2-${c.id}`} className="sr-only">
              {c.nav}
            </h2>
            <div className="mx-auto h-full max-w-[1500px] px-6 pb-8 lg:px-10" style={{ paddingTop: HEADER + 64 }}>
              <View ref={chapterRef} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <ChapterNav active={chapter} light={light} onSelect={jump} />
      {light && <ScrollHint step={step} />}
      {nextIndex < chapters.length && <NextTeaser index={nextIndex} light={light} onNext={() => go(1)} />}
      <p className="sr-only" aria-live="polite">
        {phase === "title" ? (step === 0 ? "Zeit — Einführung" : `Kapitel ${c.no}: ${c.nav}`) : `${c.nav} — Inhalt`}
      </p>
    </div>
  );
}

// ── The title layer — the alpine footage carrying the active headline ─────────

function TitleLayer({ step }: { step: number }) {
  const isIntro = step === 0;
  const chapter = Math.floor(step / 2);
  const c = chapters[chapter];
  const t = isIntro ? intro : c;
  const key = isIntro ? "intro" : String(chapter);
  const Tag = isIntro ? "h1" : "h2";

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={startMutedVideo}
        autoPlay
        muted
        loop
        playsInline
        poster="/video/alpine-poster.jpg"
        src="/video/alpine.mp4"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-night/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-night/45" />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-center px-6 lg:px-10" style={{ paddingTop: HEADER + 40 }}>
        <AnimatePresence mode="wait">
          <motion.div key={key} initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className={`${LABEL} text-gold`}
            >
              {isIntro ? "Säule I · Zeit" : `( ${c.no} ) ${c.nav}`}
            </motion.p>
            <Tag className="t-hero mt-6 max-w-[16ch] text-[clamp(2.6rem,7vw,6.2rem)] text-cream">
              {t.title.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.95, ease: EASE, delay: 0.05 + i * 0.09 }}
                    className={`block ${isIntro && i === 1 ? "t-accent text-gold" : ""}`}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </Tag>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="mt-7 max-w-xl text-[0.9rem] leading-[1.75] text-cream/75 lg:text-base"
            >
              {t.lead}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Chrome: chapter nav, scroll hint, next teaser ─────────────────────────────

function ChapterNav({ active, light, onSelect }: { active: number; light: boolean; onSelect: (i: number) => void }) {
  return (
    <nav aria-label="Kapitel" className="absolute inset-x-0 z-20" style={{ top: HEADER }}>
      <div className="mx-auto flex max-w-[1500px] items-center gap-7 px-6 py-3 lg:px-10">
        {chapters.map((c, i) => {
          const on = i === active;
          return (
            <button
              key={c.id}
              type="button"
              data-cursor
              aria-current={on ? "step" : undefined}
              onClick={() => onSelect(i)}
              className={`relative min-h-11 ${LABEL} transition-colors duration-300 ${
                light ? (on ? "text-cream" : "text-cream/50 hover:text-cream") : on ? "text-night" : "text-night/45 hover:text-night"
              }`}
            >
              <span className="mr-2 tabular-nums opacity-60">{c.no}</span>
              {c.nav}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-2 h-px origin-left transition-transform duration-500 ease-deep ${
                  light ? "bg-gold" : "bg-terrakotta"
                } ${on ? "scale-x-100" : "scale-x-0"}`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ScrollHint({ step }: { step: number }) {
  return (
    <div className="pointer-events-none absolute bottom-8 left-6 z-20 flex items-center gap-4 lg:left-10">
      <HourglassGlyph className="h-9 w-auto text-gold" sand={step / (STEPS - 1)} strokeWidth={2} />
      <p className={`${LABEL} text-cream/70`}>Scrollen, um fortzufahren</p>
    </div>
  );
}

function NextTeaser({ index, light, onNext }: { index: number; light: boolean; onNext: () => void }) {
  const n = chapters[index];
  return (
    <button
      type="button"
      data-cursor
      onClick={onNext}
      className={`group absolute right-6 z-20 flex items-center gap-4 text-left lg:right-10 ${light ? "text-cream" : "text-night"}`}
      style={{ top: HEADER + 8 }}
    >
      <span>
        <span className={`block font-body text-[0.58rem] uppercase tracking-[0.24em] ${light ? "text-cream/55" : "text-night/50"}`}>
          Nächster Abschnitt
        </span>
        <span className="mt-0.5 flex items-center gap-2 font-body text-[0.8rem] font-bold">
          {n.nav}
          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </span>
      <span className="relative hidden h-12 w-[4.5rem] overflow-hidden xl:block">
        <Image src={n.image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="72px" />
      </span>
    </button>
  );
}

// ── The stacked fallback ──────────────────────────────────────────────────────

function Stacked() {
  return (
    <div className="bg-cream text-night">
      <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-night px-6 pb-16 pt-32 text-cream lg:px-10">
        <video
          ref={startMutedVideo}
          autoPlay
          muted
          loop
          playsInline
          poster="/video/alpine-poster.jpg"
          src="/video/alpine.mp4"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-night/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1500px]">
          <p className={`${LABEL} text-gold`}>Säule I · Zeit</p>
          <h1 className="t-hero mt-5 text-[clamp(2.4rem,9vw,5.5rem)] text-cream">
            {intro.title[0]}
            <br />
            <span className="t-accent text-gold">{intro.title[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[0.9rem] leading-[1.75] text-cream/75">{intro.lead}</p>
        </div>
      </section>

      {chapters.map((c, i) => {
        const View = VIEWS[i];
        return (
          <section key={c.id} id={`kapitel-${c.id}`} className="border-t border-night/10 px-6 py-16 first:border-0 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-[1500px]">
              <p className={`${LABEL} text-terrakotta`}>
                ( {c.no} ) {c.nav}
              </p>
              <h2 className="t-h1 mt-4 text-night">{c.title.join(" ")}</h2>
              <p className="mt-4 max-w-xl text-[0.9rem] leading-[1.75] text-night/70">{c.lead}</p>
              <div className="mt-12">
                <View stacked />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
