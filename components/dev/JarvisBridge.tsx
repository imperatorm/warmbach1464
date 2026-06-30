"use client";
import { useEffect } from "react";

/**
 * DEV-ONLY. Reports the clicked element's source location (data-insp-path, injected by
 * code-inspector-plugin) to the parent window (the Jarvis cockpit) via postMessage.
 * Rendered only in development from app/layout.tsx. No-op if not inside an iframe.
 */
export function JarvisBridge() {
  useEffect(() => {
    if (window.parent === window) return; // only act when embedded in the cockpit

    let inspect = false;

    function onMessage(e: MessageEvent) {
      // Accept same-origin (hosted cockpit proxies the site under /preview) or localhost (local dev).
      if (e.origin !== window.location.origin && !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(e.origin)) return;
      if (e?.data?.source === "jarvis" && e.data.type === "set-inspect") {
        inspect = Boolean(e.data.value);
        document.documentElement.style.cursor = inspect ? "crosshair" : "";
      }
    }

    function onClick(e: MouseEvent) {
      if (!inspect) return;
      const el = (e.target as Element | null)?.closest?.("[data-insp-path]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const insp = el.getAttribute("data-insp-path");
      const rect = el.getBoundingClientRect();
      window.parent.postMessage(
        {
          source: "jarvis",
          type: "select",
          insp,
          text: (el.textContent || "").trim().slice(0, 80),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        },
        "*",
      );
    }

    window.addEventListener("message", onMessage);
    document.addEventListener("click", onClick, true); // capture phase: beat app handlers
    window.parent.postMessage({ source: "jarvis", type: "ready" }, "*");
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
