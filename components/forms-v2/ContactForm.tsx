"use client";

import { useRef, useState } from "react";
import { brand } from "@/lib/content";
import { formatInquiry, validateInquiry } from "@/lib/inquiry";

type Field = "name" | "email" | "message";

const LABELS: Record<Field, string> = {
  name: "Name",
  email: "E-Mail",
  message: "Anlass",
};

type Status = "idle" | "submitting" | "sent" | "failed";

/**
 * The concierge inquiry form in the house form language (redesign/journal-galerie):
 * fields on a baseline hairline rather than in boxes, micro-caps labels, the
 * cream pill for the submit, and the long "Anlass" label split into a short
 * label plus a described hint.
 *
 * Staging version for /contact/v2. The look is the branch's; the transport is
 * main's — it posts to /api/inquiry and calls nothing sent until the route
 * confirms delivery, exactly like components/v3/ContactForm.
 */
export function ContactForm() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    setErrors((err) => ({ ...err, [f]: undefined }));
    if (status === "failed") setStatus("idle");
  };

  const mailtoFallback = () => {
    const { subject, text } = formatInquiry({ kind: "contact", ...values });
    return `mailto:${brand.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validateInquiry({ kind: "contact", ...values });
    const next: Partial<Record<Field, string>> = {};
    for (const err of found) next[err.field as Field] = err.message;
    setErrors(next);
    if (found.length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "contact", ...values }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  if (status === "sent") {
    return (
      <div className="border-t border-gold/50 pt-6" role="status">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold">
          Anfrage eingegangen
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
          Ihre Anfrage liegt beim Concierge. Wir antworten persönlich innerhalb von 48 Stunden — an{" "}
          <span className="text-cream/90">{values.email.trim()}</span>.
        </p>
      </div>
    );
  }

  const labelClass = "mb-2 block text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-cream/70";
  const fieldClass = (f: Field) =>
    `w-full border-b bg-transparent px-0 py-3 text-base text-cream placeholder:text-cream/30 transition-colors duration-300 focus:outline-none disabled:opacity-60 ${
      errors[f] ? "border-terrakotta" : "border-cream/25 focus:border-gold"
    }`;

  const busy = status === "submitting";

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
              disabled={busy}
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
          disabled={busy}
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

      {status === "failed" && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-8 border-t border-terrakotta/60 pt-5 text-sm leading-relaxed text-cream/80 focus:outline-none"
        >
          Ihre Anfrage konnte nicht zugestellt werden — sie ist <strong className="font-semibold text-cream">nicht</strong>{" "}
          bei uns angekommen. Ihre Eingaben bleiben erhalten: bitte erneut senden, oder direkt schreiben an{" "}
          <a href={mailtoFallback()} data-cursor className="link-underline text-gold">
            {brand.contactEmail}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        data-cursor
        disabled={busy}
        className="mt-10 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-night transition-colors duration-300 hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-60"
      >
        {busy ? "Wird gesendet …" : "Anfrage senden"}
      </button>
    </form>
  );
}
