"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FmButton } from "./FmButton";

/**
 * Hero — the title sheet of the reference: a lit green room, the product
 * floating in a cone of light, the headline top-left, the claim and the door
 * bottom-right. Our product is the crystal decanter: the studio photograph,
 * screen-blended so its black ground disappears into the green and only the
 * glass is left hanging in the light, sinking slowly against the scroll.
 *
 * From `sm` the object is pinned to the centre of the room and the copy
 * occupies the corners around it; on a phone there is no room around it, so
 * the object takes its place in the flow between the headline and the claim.
 *
 * (The WebGL decanter was tried here and taken out again: its refraction
 * backdrop is a dark disc that reads as a box on any ground that is not
 * night, and the hero already carries the LCP image.)
 */
export function FmHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const objectY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 160]);
  const objectScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.86]);
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-fm-green text-fm-beige">
      {/* The room: a cone of light from above, deeper green toward the floor,
          two soft pillars of light either side of the object. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_75%_at_50%_-12%,rgba(110,146,79,0.9),transparent_62%),linear-gradient(180deg,#324a26_0%,#2a3f24_55%,#243622_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[14%] hidden w-[16%] bg-gradient-to-r from-transparent via-fm-leaf/30 to-transparent blur-3xl lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-[18%] bg-gradient-to-r from-transparent via-fm-leaf/25 to-transparent blur-3xl lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(110,146,79,0.35),transparent_70%)]"
      />

      <div className="relative flex min-h-[100svh] flex-col justify-between px-6 pb-10 pt-28 lg:px-10 lg:pb-14 lg:pt-32">
        <motion.h1
          style={{ y: copyY }}
          className="fm-h relative z-10 max-w-[9ch] text-[clamp(3rem,8.4vw,8.6rem)]"
        >
          Ein Hof.
          <br />
          Ein Brand.
        </motion.h1>

        {/* The object. The blend sits on the transformed wrapper: a transform
            makes a stacking context, and an image blending inside one only
            sees its own empty backdrop, not the room behind it. */}
        <div className="pointer-events-none relative my-6 flex justify-center sm:absolute sm:inset-0 sm:my-0 sm:items-center">
          <motion.div
            style={{ y: objectY, scale: objectScale }}
            className="relative h-[min(46svh,520px)] w-[min(72vw,520px)] mix-blend-screen [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:mt-[6svh] sm:h-[min(70svh,760px)]"
          >
            {/* A soft pool of light the glass hangs in, so the blend has something to lift */}
            <div
              aria-hidden
              className="absolute inset-[8%] rounded-full bg-[radial-gradient(ellipse_at_50%_45%,rgba(110,146,79,0.55),transparent_68%)] blur-2xl"
            />
            <Image
              src="/flasche/shot-front.jpg"
              alt="Die 1464byW Kristallflasche mit Medaillon und Stern-Schliff"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 72vw"
              className="object-contain [filter:contrast(1.35)_brightness(1.02)] [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)]"
            />
          </motion.div>
        </div>

        <motion.div
          style={{ y: copyY }}
          className="relative z-10 flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="fm-up hidden text-[0.62rem] tracking-[0.18em] text-fm-beige/55 sm:block">
            Warmbachhof · Kitzbühel
            <br />
            47°27′ N · 12°23′ O — 760 m ü. A.
          </p>
          <div className="max-w-[26rem]">
            <p className="fm-h text-[clamp(1.9rem,3.6vw,3.6rem)]">
              From our Soil.
              <br />
              To your Soul.
            </p>
            <p className="fm-up mt-6 max-w-[22rem] text-fm-beige/75">
              Edelbrand vom Warmbachhof, Kitzbühel. Erstmals 1464 im Salbuch verzeichnet — heute
              zum ersten Mal selbst gebrannt.
            </p>
            <FmButton href="/editions" className="mt-8">
              Die Editionen
            </FmButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
