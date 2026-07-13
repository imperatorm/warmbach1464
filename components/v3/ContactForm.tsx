"use client";

import { useState } from "react";
import { brand } from "@/lib/content";

type Field = "name" | "email" | "message";

const LABELS: Record<Field, string> = {
  name: "Name",
  email: "E-Mail",
  message: "Anlass — Tasting, Patron Cask, Gästehaus, Sonstiges",
};

/**
 * The concierge inquiry form, on the design system: real labels (not just
 * placeholders), token-styled fields, client-side validation. There is no
 * backend yet — a valid submission opens a prepared mail to the concierge
 * and shows a confirmation state.
 */
export function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    setErrors((err) => ({ ...err, [f]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = "Bitte Ihren Namen angeben.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (values.message.trim().length < 10)
      next.message = "Bitte Ihr Anliegen in ein, zwei Sätzen beschreiben.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject = encodeURIComponent(`Anfrage über warmbachhof.com — ${values.name.trim()}`);
    const body = encodeURIComponent(`${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`);
    window.location.href = `mailto:${brand.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="border border-gold/40 px-8 py-10 text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">Anfrage vorgemerkt</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70">
          Ihr E-Mail-Programm sollte sich geöffnet haben. Falls nicht: schreiben Sie uns direkt an{" "}
          <a href={`mailto:${brand.contactEmail}`} data-cursor className="link-underline text-gold">
            {brand.contactEmail}
          </a>
          . Wir antworten persönlich — nicht sofort, aber verlässlich.
        </p>
      </div>
    );
  }

  const fieldClass = (f: Field) =>
    `w-full border bg-soot/60 px-4 py-3.5 text-sm text-cream placeholder:text-stone/50 focus:border-gold focus:outline-none ${
      errors[f] ? "border-terrakotta" : "border-hairline/30"
    }`;

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {(["name", "email"] as const).map((f) => (
          <div key={f}>
            <label htmlFor={`contact-${f}`} className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
              {LABELS[f]}
            </label>
            <input
              id={`contact-${f}`}
              type={f === "email" ? "email" : "text"}
              autoComplete={f === "email" ? "email" : "name"}
              value={values[f]}
              onChange={set(f)}
              aria-invalid={Boolean(errors[f])}
              className={fieldClass(f)}
            />
            {errors[f] && (
              <p className="mt-2 text-xs text-terrakotta" role="alert">
                {errors[f]}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5">
        <label htmlFor="contact-message" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
          {LABELS.message}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          className={fieldClass("message")}
        />
        {errors.message && (
          <p className="mt-2 text-xs text-terrakotta" role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <button type="submit" data-cursor className="btn-primary mt-8">
        Anfrage senden <span aria-hidden>&rarr;</span>
      </button>
    </form>
  );
}
