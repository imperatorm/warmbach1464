"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChapterHead } from "./ChapterHead";
import { Reveal } from "@/components/ui/Reveal";

type Material = {
  key: string;
  no: string;
  name: string;
  pantone: string;
  usage: string;
  hex: string;
  rgb: string;
  cmyk: string;
  src: string;
  alt: string;
  /** swatch ink: dark card ⇒ light type, light card ⇒ night type */
  ink: "light" | "dark";
};

// The Pantone scheme from the brand board: page color, both accents, the green.
const MATERIALS: Material[] = [
  {
    key: "cloud",
    no: "M·01",
    name: "Cloud Dancer",
    pantone: "PANTONE 11-4201 TCX",
    usage: "Seitenfarbe",
    hex: "#F0EFEB",
    rgb: "240 · 239 · 235",
    cmyk: "0 · 0 · 2 · 6",
    src: "/gallery/warmbach/img_0059.jpg",
    alt: "Der Warmbachhof in der Winterdämmerung",
    ink: "dark",
  },
  {
    key: "copper",
    no: "M·02",
    name: "Copper",
    pantone: "PANTONE 16-1325 TCX",
    usage: "Akzent 1",
    hex: "#C57E5B",
    rgb: "197 · 126 · 91",
    cmyk: "0 · 36 · 54 · 23",
    src: "/gallery/warmbach/img_0080.jpg",
    alt: "Die kupferne Kothe-Brennblase mit der Prägung 1464",
    ink: "dark",
  },
  {
    key: "oxblood",
    no: "M·03",
    name: "Oxblood Red",
    pantone: "PANTONE 19-1524 TCX",
    usage: "Akzent 2",
    hex: "#713940",
    rgb: "113 · 57 · 64",
    cmyk: "0 · 50 · 43 · 56",
    src: "/gallery/warmbach/img_0096.jpg",
    alt: "Die geschwungene Holztreppe im warmen Kupferlicht",
    ink: "light",
  },
  {
    key: "bronze",
    no: "M·04",
    name: "Bronze Green",
    pantone: "PANTONE 18-0317 TCX",
    usage: "Warmbach Green",
    hex: "#485F49",
    rgb: "72 · 95 · 73",
    cmyk: "24 · 0 · 23 · 63",
    src: "/gallery/warmbach/img_0030.jpg",
    alt: "Der Osthang mit Hof und Wald über Kitzbühel",
    ink: "light",
  },
];

/**
 * Chapter 02 — the material palette. Four tall texture cards cut from the
 * house itself, each carrying a floating swatch card with the exact brand
 * values. Hovering a card lets it breathe wider; clicking the swatch copies
 * the HEX value to the clipboard.
 */
export function MaterialPalette() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async (m: Material) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(m.hex);
      ok = true;
    } catch {
      // No secure context / focus — legacy path
      const ta = document.createElement("textarea");
      ta.value = m.hex;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
    }
    if (!ok) return; // values stay readable on the card
    setCopied(m.key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1800);
  };

  return (
    <section className="bg-night px-6 py-24 text-cream lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <ChapterHead no="02" title="Material" aside="Palette des Hofes — Klick kopiert den HEX-Wert" tone="dark" />

        <div className="flex flex-col gap-4 lg:h-[74vh] lg:min-h-[540px] lg:flex-row">
          {MATERIALS.map((m, i) => {
            const inkText = m.ink === "light" ? "text-cream" : "text-night";
            const inkRule = m.ink === "light" ? "border-cream/25" : "border-night/25";
            const inkDim = m.ink === "light" ? "text-cream/65" : "text-night/60";
            return (
              <Reveal
                key={m.key}
                delay={i * 0.07}
                y={36}
                className="group relative h-[62vh] min-h-[420px] overflow-hidden lg:h-auto lg:flex-[1] lg:transition-[flex-grow] lg:duration-700 lg:ease-deep lg:hover:flex-[1.85]"
              >
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-deep group-hover:scale-[1.06]"
                  sizes="(min-width: 1024px) 32vw, 100vw"
                />
                <div className="absolute inset-0 bg-night/15 transition-colors duration-700 group-hover:bg-night/0" />

                {/* Card index — top-left folio mark */}
                <span className="absolute left-4 top-4 text-[0.6rem] uppercase tracking-[0.28em] text-cream/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
                  {m.no}
                </span>

                {/* Floating swatch card — the EcoWood move */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <button
                    type="button"
                    data-cursor
                    onClick={() => copy(m)}
                    aria-label={`Farbwert ${m.name} (${m.hex}) kopieren`}
                    className="w-[78%] max-w-[248px] p-5 text-left shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-deep group-hover:-translate-y-1.5"
                    style={{ backgroundColor: m.hex }}
                  >
                    <span className={`block font-display text-2xl leading-tight ${inkText}`}>{m.name}</span>
                    <span className={`mt-1 block font-mono text-[0.58rem] tracking-[0.08em] ${inkDim}`}>{m.pantone}</span>
                    <span className={`mt-1 block text-[0.6rem] uppercase tracking-[0.22em] ${inkDim}`}>{m.usage}</span>
                    <span className={`mt-4 block border-t pt-3 ${inkRule}`}>
                      <span className={`block font-mono text-[0.62rem] tracking-[0.08em] ${inkText}`}>HEX&nbsp;&nbsp;{m.hex}</span>
                      <span className={`mt-1 block font-mono text-[0.62rem] tracking-[0.08em] ${inkDim}`}>RGB&nbsp;&nbsp;{m.rgb}</span>
                      <span className={`mt-1 block font-mono text-[0.62rem] tracking-[0.08em] ${inkDim}`}>CMYK&nbsp;{m.cmyk}</span>
                    </span>
                    <span
                      className={`mt-4 block text-[0.6rem] uppercase tracking-[0.22em] transition-opacity duration-300 ${
                        copied === m.key ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                      } ${copied === m.key ? inkText : inkDim}`}
                      aria-live="polite"
                    >
                      {copied === m.key ? "Kopiert ✓" : "Kopieren"}
                    </span>
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-cream/55">
            Vier Töne, ein Haus. Seitenfarbe, zwei Akzente und das Warmbach Green —
            Pantone-gesetzt, im Material des Hofs wiedergefunden.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
