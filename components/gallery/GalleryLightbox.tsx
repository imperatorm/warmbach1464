"use client";

import { useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { sectionOrder, type GalleryImage } from "@/lib/gallery";
import { ChevronLeft, ChevronRight, Close } from "./icons";

/** The shared morph name. Only ever on two elements at once: source and target. */
const FRAME = "gallery-frame";

/** `view-transition-name` predates the DOM typings we ship against. */
const nameFrame = (el: HTMLElement, name: string) =>
  el.style.setProperty("view-transition-name", name);

const labelOf = (img: GalleryImage) =>
  sectionOrder.find((s) => s.key === img.section)?.label ?? "";

type Opener = (index: number, source: HTMLElement | null) => void;

/**
 * Drives the morph. `open(i, el)` hands the lightbox the element that was
 * clicked; that element and the full-screen photograph share one
 * view-transition name for the length of the animation, so the print the
 * visitor touched is literally the thing that grows — no cross-fade between
 * two different pictures.
 *
 * Where View Transitions are unavailable (or motion is reduced) the state
 * still changes, it simply changes at once. Nothing depends on the animation.
 */
export function useLightbox(
  images: GalleryImage[],
  setIndex: (i: number | null) => void,
) {
  const sourceRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const canMorph = () =>
    typeof document !== "undefined" &&
    typeof (document as Document & { startViewTransition?: unknown }).startViewTransition === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const open = useCallback<Opener>(
    (index, source) => {
      returnFocusRef.current = source;
      const commit = () => flushSync(() => setIndex(index));

      if (!canMorph() || !source) {
        commit();
        return;
      }
      sourceRef.current = source;
      nameFrame(source, FRAME);
      const vt = (document as Document & {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      }).startViewTransition(commit);
      vt.finished.finally(() => {
        nameFrame(source, "");
      });
    },
    [setIndex],
  );

  const close = useCallback(() => {
    const source = sourceRef.current;
    const commit = () => flushSync(() => setIndex(null));

    if (!canMorph() || !source) {
      commit();
      returnFocusRef.current?.focus();
      return;
    }
    // The photograph shrinks back into the print it came from — but only if
    // that print is still the one on screen. After paging it is not, so the
    // name goes on nothing and the view simply fades.
    nameFrame(source, FRAME);
    const vt = (document as Document & {
      startViewTransition: (cb: () => void) => { finished: Promise<void> };
    }).startViewTransition(commit);
    vt.finished.finally(() => {
      nameFrame(source, "");
      returnFocusRef.current?.focus();
    });
  }, [setIndex]);

  return { open, close, sourceRef };
}

export function GalleryLightbox({
  images,
  index,
  onClose,
  onPage,
}: {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onPage: (delta: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onPage(1);
      else if (e.key === "ArrowLeft") onPage(-1);
      else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the dialog itself, not a control — the photograph is the content.
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, onClose, onPage]);

  if (index === null) return null;
  const img = images[index];

  const control =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 bg-night/70 text-cream/80 backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-gold";

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${labelOf(img)} — Aufnahme ${index + 1} von ${images.length}`}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-night/95 px-4 backdrop-blur-sm focus:outline-none"
    >
      <button onClick={onClose} aria-label="Schließen" className={`${control} absolute right-5 top-5 z-10`}>
        <Close />
      </button>

      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full flex-col items-center">
        {/* The frame is sized from the photograph's own proportions before a
            single byte of it arrives, so the view never collapses around a
            loading image — and the morph has a stable box to fly into. */}
        <div
          key={img.src}
          className="relative max-h-[78svh] max-w-[92vw] bg-soot/40"
          style={{
            aspectRatio: `${img.width} / ${img.height}`,
            width: `min(92vw, calc(78svh * ${img.width / img.height}))`,
            viewTransitionName: FRAME,
          }}
        >
          <Image
            src={img.src}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            quality={82}
            priority
            alt={`${labelOf(img)}, Warmbachhof`}
            className="object-contain"
          />
        </div>

        {/* What is true about this frame and nothing more: which part of the
            estate it shows, and where it sits in the set. */}
        <div className="mt-5 flex items-center gap-5">
          <button onClick={() => onPage(-1)} aria-label="Vorherige Aufnahme" className={control}>
            <ChevronLeft />
          </button>
          <p className="min-w-[10rem] text-center text-[0.62rem] uppercase tracking-[0.24em] text-cream/60">
            {labelOf(img)}
            <span className="mx-2 text-cream/25">·</span>
            <span className="tabular-nums text-cream/80">
              {String(index + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}
            </span>
          </p>
          <button onClick={() => onPage(1)} aria-label="Nächste Aufnahme" className={control}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
