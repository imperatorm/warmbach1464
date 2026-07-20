"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isOfLegalAge } from "@/lib/age";
import { AGE_STORAGE_KEY, AGE_CONFIRMED_EVENT } from "@/lib/useAgeConfirmed";

// Field order and shape follow the German date notation TT·MM·JJJJ.
const FIELDS = [
  { key: "day", label: "Tag", placeholder: "TT", size: 2 },
  { key: "month", label: "Monat", placeholder: "MM", size: 2 },
  { key: "year", label: "Jahr", placeholder: "JJJJ", size: 4 },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

/**
 * The age threshold as a title sheet of its own (Suno's birthday step,
 * reframed in the house style): a dark full-viewport page, one serif
 * question, three explicit date fields instead of a native picker, and
 * the privacy note that the date itself never leaves the device.
 */
export function AgeGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Record<FieldKey, string>>({ day: "", month: "", year: "" });
  const [error, setError] = useState("");
  const refs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    // localStorage hier nur für Age-Gate (gesetzlich erforderlich, kein Tracking)
    try {
      if (!localStorage.getItem(AGE_STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function setField(key: FieldKey, raw: string, size: number, nextKey?: FieldKey) {
    const digits = raw.replace(/\D/g, "").slice(0, size);
    setValue((v) => ({ ...v, [key]: digits }));
    setError("");
    // Suno-style auto-advance once a field is filled
    if (digits.length === size && nextKey) refs.current[nextKey]?.focus();
  }

  function confirm() {
    const { day, month, year } = value;
    if (!day || !month || year.length < 4) {
      setError("Bitte Geburtsdatum eingeben.");
      return;
    }
    const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    // DE threshold (18) as the stricter default; AT is 16 (see lib/age).
    if (!isOfLegalAge(iso, "DE")) {
      setError("Wir verkaufen ausschließlich an Volljährige.");
      return;
    }
    try { localStorage.setItem(AGE_STORAGE_KEY, "1"); } catch {}
    window.dispatchEvent(new Event(AGE_CONFIRMED_EVENT)); // wakes the deferred hero scene
    setOpen(false);
  }

  if (pathname === "/enter" || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-night px-6"
    >
      {/* The house spotlight + ghost numeral — same room as the rest of the sheet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_42%,_rgba(184,137,58,0.10),_transparent_70%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[42vw] leading-none text-cream/[0.03] lg:text-[24rem]"
      >
        1464
      </span>

      <div className="relative w-full max-w-md text-center motion-safe:animate-[fadeIn_0.8s_ease-out]">
        <p className="t-label mb-6">Vor dem Eintritt</p>
        <h2 id="agegate-title" className="font-display text-3xl leading-tight text-cream sm:text-4xl">
          Wann sind Sie geboren?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-stone">
          Ihr Geburtsdatum wird nicht gespeichert — nur die Bestätigung, auf diesem Gerät.
        </p>

        {/* TT · MM · JJJJ — explicit fields on the baseline hairline */}
        <div className="mt-10 flex items-end justify-center gap-4 sm:gap-6">
          {FIELDS.map((f, i) => (
            <label key={f.key} className="flex flex-col items-start gap-2">
              <span className="text-[0.55rem] uppercase tracking-[0.28em] text-cream/40">{f.label}</span>
              <input
                ref={(el) => { refs.current[f.key] = el; }}
                value={value[f.key]}
                onChange={(e) => setField(f.key, e.target.value, f.size, FIELDS[i + 1]?.key)}
                inputMode="numeric"
                autoComplete={f.key === "year" ? "bday-year" : f.key === "month" ? "bday-month" : "bday-day"}
                placeholder={f.placeholder}
                maxLength={f.size}
                autoFocus={i === 0}
                className={`border-b border-hairline/30 bg-transparent pb-2 text-center font-display text-2xl text-cream placeholder:text-cream/20 focus:border-gold focus:outline-none sm:text-3xl ${
                  f.size === 4 ? "w-24 sm:w-28" : "w-14 sm:w-16"
                }`}
              />
            </label>
          ))}
        </div>

        <p aria-live="polite" className="mt-4 min-h-[1rem] text-xs text-gold">
          {error}
        </p>

        <button onClick={confirm} className="btn-primary mt-6 w-full justify-center">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.22em]">Eintreten</span>
          <span aria-hidden>&rarr;</span>
        </button>

        <p className="mt-8 text-[0.6rem] uppercase tracking-[0.22em] leading-relaxed text-stone/60">
          Genuss mit Maß · Kein Verkauf an Minderjährige
        </p>
      </div>
    </div>
  );
}
