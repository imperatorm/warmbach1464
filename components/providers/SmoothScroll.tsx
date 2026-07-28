"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { registerLenis } from "@/lib/smoothScroll";

/**
 * Global smooth scroll (briefing §4.7): Lenis with a long, quartic-eased glide.
 * Side-effect only — Lenis drives window scroll, so framer-motion's useScroll /
 * whileInView read it directly. Disabled under prefers-reduced-motion.
 *
 * Exactly one instance and one RAF loop for the whole app. The instance is
 * registered on lib/smoothScroll so features that must drive scrolling
 * imperatively (the Boden Auto Tour) can borrow it rather than starting a
 * competing loop.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    // dev-only: lets tooling drive real scroll (Lenis owns the scroll position)
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }
    registerLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
