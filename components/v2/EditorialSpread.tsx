"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChapterHead } from "./ChapterHead";
import { Reveal } from "@/components/ui/Reveal";

/** Image that drifts gently against the scroll inside its crop. */
function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  speed = 1,
}: {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-7 * speed}%`, `${7 * speed}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[9%]">
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
      </motion.div>
    </div>
  );
}

/**
 * Chapter 04 — the estate spread: the big offset landscape on the right,
 * a portrait specimen lower left, captions set small along the hairlines —
 * the asymmetric print composition from the reference sheet.
 */
export function EditorialSpread() {
  return (
    <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <ChapterHead no="04" title="Der Hof" aside="Osthang über Kitzbühel" />

        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          {/* Big landscape — pushed right off the axis */}
          <Reveal className="lg:col-span-8 lg:col-start-5">
            <ParallaxImage
              src="/gallery/warmbach/img_0027.jpg"
              alt="Der Warmbachhof vor dem Wilden Kaiser"
              className="aspect-[3/2]"
              sizes="(min-width: 1024px) 62vw, 100vw"
            />
            <p className="mt-3 text-right text-[0.65rem] uppercase tracking-[0.22em] text-copper">
              Der Hof vor dem Wilden Kaiser — 760 m ü. A.
            </p>
          </Reveal>

          {/* Portrait specimen + reading text, hanging lower left */}
          <Reveal className="lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:mt-40">
            <ParallaxImage
              src="/gallery/warmbach/img_0096.jpg"
              alt="Die geschwungene Holztreppe im Inneren des Hofs"
              className="aspect-[3/4] max-w-[340px]"
              sizes="(min-width: 1024px) 340px, 80vw"
              speed={1.5}
            />
            <p className="mt-3 text-[0.65rem] uppercase tracking-[0.22em] text-copper">Innen: Altholz, Stein, Kupferlicht</p>
          </Reveal>

          {/* Reading block */}
          <div className="lg:col-span-6 lg:col-start-6">
            <Reveal>
              <p className="max-w-xl text-base leading-relaxed text-night/70 lg:text-lg">
                Seit Mai 2026 arbeitet im Gewölbe die kupferne Kothe-Anlage — 100 und 400 Liter,
                schonender Zweifachbrand, Engschnitt im Herzstück. Darüber: Bar und Lounge im
                wiederaufgebauten Holz des Brixentals. Der Hof ist kein Etikett, er ist der Ort.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <Link
                  href="/galerie"
                  data-cursor
                  className="group inline-flex items-center gap-3 border border-copper/40 px-6 py-3.5 transition-colors duration-500 hover:border-terrakotta/70"
                >
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-night transition-colors group-hover:text-terrakotta">
                    Zur Galerie
                  </span>
                  <span aria-hidden className="text-terrakotta/80 transition-transform duration-500 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
                <Link
                  href="/contact"
                  data-cursor
                  className="link-underline text-xs uppercase tracking-[0.18em] text-copper transition-colors hover:text-night"
                >
                  Besuch anfragen
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
