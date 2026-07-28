import type Lenis from "@studio-freight/lenis";

/**
 * Minimal imperative handle on the single global Lenis instance.
 *
 * The app already runs exactly one Lenis, driven by one RAF loop inside
 * <SmoothScroll />. Anything that needs to drive scrolling programmatically
 * (the Boden Auto Tour) borrows that instance through here instead of
 * constructing a second instance or a second RAF loop.
 *
 * When Lenis is absent — reduced motion, or before hydration — every call
 * falls back to native window scrolling, so behaviour degrades rather than
 * breaking.
 */

let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Total scrollable distance of the document, in px. */
export function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

/** Current scroll position, in px. */
export function currentScroll(): number {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

/**
 * Take manual control of the scroll position.
 *
 * Lenis is a scroll *owner*: issuing it a `scrollTo` command every frame makes
 * its own animation loop fight the caller and the position stalls. So for
 * frame-by-frame driving we stand Lenis down first, write the position
 * natively, then hand control back — which also re-syncs Lenis to wherever we
 * finished.
 */
export function beginProgrammaticScroll() {
  instance?.stop();
}

export function endProgrammaticScroll() {
  instance?.start();
}

/** Jump to an absolute offset with no easing — used to drive a tween frame by frame. */
export function scrollToImmediate(y: number) {
  window.scrollTo(0, y);
}

/** Smoothly scroll to an element or offset (anchor navigation). */
export function scrollTo(target: string | number, offset = 0) {
  const l = instance;
  if (l) {
    l.scrollTo(target, { offset });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(target);
  if (el) {
    const y = el.getBoundingClientRect().top + currentScroll() + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
