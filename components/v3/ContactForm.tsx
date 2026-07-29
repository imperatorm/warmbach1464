"use client";

import { useState } from "react";
import { brand } from "@/lib/content";

type Field = "name" | "email" | "message";

const LABELS: Record<Field, string> = {
  name: "Name",
  email: "E-Mail",
  message: "Anlass",
};

/**
 * The concierge inquiry form, in the house form language: fields sit on a
 * baseline hairline rather than in boxes (the same treatment as the age gate),
 * labels are micro-caps, and the submit is the cream pill used for every other
 * primary door on the site.
 *
 * Real labels, client-side validation and aria-invalid/role=alert are kept as
 * they were. There is no backend yet — a valid submission opens a prepared
 * mail to the concierge and shows a confirmation state.
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
      <div className="border-t border-gold/50 pt-6">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">
          Anfrage vorgemerkt
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
          Ihr E-Mail-Programm sollte sich geöffnet haben. Falls nicht: schreiben Sie uns
          direkt an{" "}
          <a
            href={`mailto:${brand.contactEmail}`}
            data-cursor
            className="text-gold underline underline-offset-4 transition-colors duration-300 hover:text-cream"
          >
            {brand.contactEmail}
          </a>
          . Wir antworten persönlich — nicht sofort, aber verlässlich.
        </p>
      </div>
    );
  }

  const labelClass = "mb-2 block text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-cream/70";
  const fieldClass = (f: Field) =>
    `w-full border-b bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/30 transition-colors duration-300 focus:outline-none ${
      errors[f] ? "border-terrakotta" : "border-cream/25 focus:border-gold"
    }`;

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {(["name", "email"] as const).map((f) => (
          <div key={f}>
            <label htmlFor={`contact-${f}`} className={labelClass}>
              {LABELS[f]}
            </label>
            <input
              id={`contact-${f}`}
              type={f === "email" ? "email" : "text"}
              autoComplete={f === "email" ? "email" : "name"}
              value={values[f]}
              onChange={set(f)}
              aria-invalid={Boolean(errors[f])}
              aria-describedby={errors[f] ? `contact-${f}-error` : undefined}
              className={fieldClass(f)}
            />
            {errors[f] && (
              <p id={`contact-${f}-error`} className="mt-2 text-xs text-terrakotta" role="alert">
                {errors[f]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <label htmlFor="contact-message" className={labelClass}>
          {LABELS.message}
        </label>
        <p id="contact-message-hint" className="mb-1 text-xs text-cream/60">
          Tasting, Patron Cask, Gästehaus — oder etwas Eigenes.
        </p>
        <textarea
          id="contact-message"
          rows={4}
          value={values.message}
          onChange={set("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-hint contact-message-error" : "contact-message-hint"
          }
          className={`${fieldClass("message")} resize-y`}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-2 text-xs text-terrakotta" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        data-cursor
        className="mt-10 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Anfrage senden
      </button>
    </form>
  );
}
