"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const W = 2000;
const H = 1500;

/**
 * "Warmbach im Laufe der Jahrhunderte" — the framed chronicle plaque, staged on
 * the Zeit hero from a background-free PNG so it truly floats: a soft `drop-shadow`
 * hugs the frame's silhouette (no rectangular card), and it drifts gently. It
 * opens into a readable full-screen view automatically on first arrival at Zeit
 * (per session) and on click. Close via × / backdrop / Esc.
 *
 * The float transform lives on its own wrapper so it never fights the positioning
 * wrapper's `-translate-y-1/2`. The lightbox is portaled to <body> so its `fixed`
 * escapes the page-transition transform on <main>.
 */
export function PlaketteReveal({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Auto-open once per session when arriving on Zeit ("sobald man auf Zeit geht").
  // Set the seen-flag only when the timer actually fires — React 18 StrictMode's
  // dev mount→unmount→mount clears the first timer, so setting the flag eagerly
  // would suppress the open on the second mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("wb_plakette_seen")) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("wb_plakette_seen", "1");
      setOpen(true);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      {/* Floating framed plate — positioned wrapper · float wrapper · button */}
      <div className={className}>
        <div className="animate-drift">
          <button
            type="button"
            data-cursor
            onClick={() => setOpen(true)}
            aria-label="Chronik-Plakette „Warmbach im Laufe der Jahrhunderte“ öffnen"
            className="group relative block w-full transition-transform duration-500 hover:scale-[1.02] [filter:drop-shadow(0_14px_18px_rgba(0,0,0,0.45))_drop-shadow(0_42px_58px_rgba(0,0,0,0.5))]"
          >
            <Image
              src="/zeit/plakette.png"
              width={W}
              height={H}
              sizes="(max-width: 1024px) 45vw, 24vw"
              alt="Plakette „Warmbach im Laufe der Jahrhunderte“"
              className="h-auto w-full"
              priority
            />
            <span className="pointer-events-none absolute inset-x-0 top-full mt-3 text-center text-[0.58rem] uppercase tracking-[0.28em] text-cream/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              Die Chronik · lesen
            </span>
          </button>
        </div>
      </div>

      {/* Readable lightbox — portaled to <body> so `fixed` is honoured */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={close}
                role="dialog"
                aria-modal="true"
                aria-label="Warmbach im Laufe der Jahrhunderte"
                className="fixed inset-0 z-[80] flex items-center justify-center bg-night/95 p-4 backdrop-blur-sm sm:p-8"
              >
                <button
                  onClick={close}
                  aria-label="Schließen"
                  className="absolute right-5 top-5 z-10 text-2xl text-cream/70 transition-colors hover:text-gold"
                >
                  ✕
                </button>
                <motion.figure
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative m-0"
                >
                  <Image
                    src="/zeit/plakette.png"
                    width={W}
                    height={H}
                    sizes="92vw"
                    alt="Plakette „Warmbach im Laufe der Jahrhunderte“ — die Chronik des Hofs, niedergeschrieben im Dezember 2025"
                    className="h-auto max-h-[90vh] w-auto max-w-[92vw] object-contain [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.7))]"
                    priority
                  />
                </motion.figure>
                <p className="pointer-events-none absolute inset-x-0 bottom-5 text-center text-[0.62rem] uppercase tracking-[0.3em] text-cream/55">
                  Schließen · Esc oder Hintergrund
                </p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
