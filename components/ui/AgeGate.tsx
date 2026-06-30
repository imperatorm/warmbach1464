"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isOfLegalAge } from "@/lib/age";
import { AGE_STORAGE_KEY, AGE_CONFIRMED_EVENT } from "@/lib/useAgeConfirmed";

export function AgeGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [birth, setBirth] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // localStorage hier nur für Age-Gate (gesetzlich erforderlich, kein Tracking)
    try {
      if (!localStorage.getItem(AGE_STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function confirm() {
    if (!birth) { setError("Bitte Geburtsdatum eingeben."); return; }
    // DE threshold (18) as the stricter default; AT is 16 (see lib/age).
    if (!isOfLegalAge(birth, "DE")) {
      setError("Wir verkaufen ausschließlich an Volljährige.");
      return;
    }
    try { localStorage.setItem(AGE_STORAGE_KEY, "1"); } catch {}
    window.dispatchEvent(new Event(AGE_CONFIRMED_EVENT)); // wakes the deferred hero scene
    setOpen(false);
  }

  if (pathname === "/enter" || !open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-night/95 backdrop-blur-md flex items-center justify-center px-6">
      <div className="max-w-md w-full border border-gold/40 bg-soot p-10 text-center">
        <p className="signage mb-6">Vor dem Eintritt</p>
        <h2 className="display text-3xl mb-6 text-cream">Bitte bestätigen Sie Ihr Geburtsdatum.</h2>
        <p className="text-stone text-sm mb-8">Wir verkaufen ausschließlich an Volljährige.</p>
        <input
          type="date"
          value={birth}
          onChange={e => { setBirth(e.target.value); setError(""); }}
          className="bg-night border border-hairline/30 px-4 py-3 text-cream w-full [color-scheme:dark] focus:outline-none focus:border-gold"
          aria-label="Geburtsdatum"
        />
        {error && <p className="text-gold text-xs mt-3">{error}</p>}
        <button onClick={confirm} className="btn-primary w-full mt-6 justify-center">
          Eintreten →
        </button>
        <p className="text-stone/80 text-xs mt-6">
          Genuss mit Maß. Verantwortungsvoll. Kein Verkauf an Minderjährige.
        </p>
      </div>
    </div>
  );
}
