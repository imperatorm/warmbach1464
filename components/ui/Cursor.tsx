"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor (§4.7): a small copper dot tracking 1:1, and a gold ring that
 * lags slightly and swells over interactive elements. Fine-pointer only — never
 * shown on touch. Lightweight (no library); the ring's follow-loop is skipped
 * under reduced-motion so the dot still tracks but nothing eases.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    root.classList.add("cursor-active");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      if (reduce && ring.current) ring.current.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const onOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.("a, button, [data-cursor]"))
        root.classList.add("cursor-hover");
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.("a, button, [data-cursor]"))
        root.classList.remove("cursor-hover");
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(raf);
      root.classList.remove("cursor-active", "cursor-hover");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
