"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { WarmbachLockup } from "@/components/aw/WarmbachLockup";
import type { BarProgress } from "@/components/three/BarHeroScene";

const BarHeroScene = dynamic(() => import("@/components/three/BarHeroScene"), { ssr: false });

/**
 * Hero — the bar. One camera move through the Blender bar scene, scrubbed by
 * a three-screen scroll track: from the frontal view of the lit bar, the man
 * behind it and the bottle on the long table, down to the bottle at the
 * table's edge. The lens does the storytelling — focus racks to the man for a
 * beat and returns to the bottle as the aperture opens.
 *
 * Until the scene's first graded frame is up, the Cycles render of the opening
 * frame stands in (same camera, same grade), so the hand-over is invisible.
 */

/** Track height in viewports. */
const SCREENS = 3.4;

function Phase({
  progress,
  win,
  className,
  children,
}: {
  progress: MotionValue<number>;
  win: [number, number, number, number];
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, win, [0, 1, 1, 0]);
  const blur = useTransform(progress, win, [8, 0, 0, 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const y = useTransform(progress, win, [14, 0, 0, -10]);
  return (
    <motion.div className={className} style={{ opacity, filter, y }}>
      {children}
    </motion.div>
  );
}

export function BarHero() {
  const reduce = !!useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<BarProgress>({ current: 0 }).current;
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });
  const inView = useInView(track, { margin: "10% 0px 10% 0px" });
  const [ready, setReady] = useState(false);

  // the opening title holds, then dissolves as the camera starts in
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const titleBlur = useTransform(scrollYProgress, [0.1, 0.2], [0, 10]);
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section
      ref={track}
      className="relative -mb-8 bg-black text-cream"
      style={{ height: `${SCREENS * 100}svh` }}
      aria-label="Die Bar im Warmbachhof"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the world */}
        <div className="absolute inset-0">
          <BarHeroScene progress={progress} active={inView} reduce={reduce} onReady={() => setReady(true)} />
        </div>
        {/* stand-in until the first live frame: the Cycles render of the same opening */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-black bg-cover bg-center transition-opacity duration-1000 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(/hero-bar/poster.webp)` }}
        />

        {/* legibility only where type sits */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[46svh] bg-gradient-to-t from-black/70 to-transparent" />

        {/* 0 — the title */}
        <motion.div
          className="absolute inset-0 flex flex-col"
          style={{ opacity: titleOpacity, filter: titleFilter }}
        >
          <div className="pointer-events-none relative flex flex-1 select-none items-start justify-center pt-[clamp(96px,14svh,150px)]">
            <WarmbachLockup />
          </div>
          <div className="z-10 flex flex-col items-center px-6 pb-[clamp(2.5rem,7svh,5rem)] text-center">
            <h1 className="max-w-[440px] text-sm font-medium leading-relaxed text-cream/80 md:text-base">
              Seit 1464 auf demselben Boden
            </h1>
            <p className="mt-2 max-w-[440px] text-sm font-medium leading-relaxed text-cream/70 md:text-base">
              Wie beim Wein entscheidet der Boden — worauf die Bäume stehen, schmeckt man später.
            </p>
            <div className="mt-9 flex items-center gap-4 rounded-full bg-black/45 py-1 pl-6 pr-1 backdrop-blur-md">
              <p className="hidden text-sm font-medium text-cream/90 sm:block">
                Sechsundzwanzig Generationen. Eine Quelle. Ein Osthang.
              </p>
              <p className="text-sm font-medium text-cream/90 sm:hidden">Eine Quelle. Ein Osthang.</p>
              <Link
                href="/club/mitglied-werden"
                data-cursor
                className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-cream px-5 text-sm font-medium uppercase text-night transition-colors duration-300 hover:bg-gold"
              >
                Club 1464
              </Link>
            </div>
            <motion.p
              aria-hidden
              className="mt-6 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-cream/45"
              style={{ opacity: cueOpacity }}
            >
              Scrollen
            </motion.p>
          </div>
        </motion.div>

        {/* mid-move — while the focus rests on the bar */}
        <Phase
          progress={scrollYProgress}
          win={[0.28, 0.34, 0.48, 0.56]}
          className="pointer-events-none absolute left-6 top-1/2 max-w-sm -translate-y-1/2 lg:left-10"
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">Die Bar · Warmbachhof</p>
          <p className="t-hero mt-3 text-[clamp(1.5rem,2.6vw,2.3rem)] leading-[1.12] text-cream">
            Was wir brennen, brennen wir einmal.
          </p>
        </Phase>

        {/* arrival — the bottle */}
        <Phase
          progress={scrollYProgress}
          win={[0.8, 0.9, 1.01, 1.02]}
          className="absolute bottom-0 right-0 max-w-sm px-6 pb-[clamp(3rem,9svh,6rem)] lg:pr-12"
        >
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">( 04 ) Die Flasche</p>
          <p className="t-hero mt-3 text-[clamp(1.5rem,2.6vw,2.3rem)] leading-[1.12] text-cream">Premiere Edition</p>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Tiroler Glasbläsertradition mit Wurzeln im 18. Jahrhundert. Herkunft, Hand und Siegel — die Flasche
            erzählt, wo der Brand herkommt, bevor man ihn öffnet.
          </p>
          <Link
            href="/flasche"
            data-cursor
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-cream py-1.5 pl-6 pr-1.5 text-sm font-medium uppercase text-night transition-colors duration-300 hover:bg-gold"
          >
            Zur Flasche
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-full bg-night text-cream transition-transform duration-300 group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </Link>
        </Phase>
      </div>
    </section>
  );
}
