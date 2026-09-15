"use client";

import { useRef, useState } from "react";
import { brand } from "@/lib/content";
import { formatInquiry, validateInquiry } from "@/lib/inquiry";

type Field = "name" | "email" | "message";

const LABELS: Record<Field, string> = {
  name: "Name",
  email: "E-Mail",
  message: "Anlass — Tasting, Patron Cask, Gästehaus, Sonstiges",
};

type Status = "idle" | "submitting" | "sent" | "failed";

/**
 * The concierge inquiry form. It posts to /api/inquiry and reports exactly
 * what happened: nothing is called sent until the route confirms delivery.
 * If the transport is unconfigured or refuses, the form stays intact with
 * every word the visitor wrote and hands them the direct mail path instead.
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

  /** The direct path out when the transport is down — the message travels with it. */
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
      <div className="border border-gold/40 px-8 py-10 text-center" role="status">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold">Anfrage eingegangen</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cream/70">
          Ihre Anfrage liegt beim Concierge. Wir antworten persönlich innerhalb von 48 Stunden — an{" "}
          <span className="text-cream/90">{values.email.trim()}</span>.
        </p>
      </div>
    );
  }

  const fieldClass = (f: Field) =>
    `w-full border bg-soot/60 px-4 py-3.5 text-sm text-cream placeholder:text-stone/50 focus:border-gold focus:outline-none ${
      errors[f] ? "border-terrakotta" : "border-hairline/30"
    }`;

  const busy = status === "submitting";

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
      <div className="mt-5">
        <label htmlFor="contact-message" className="mb-2 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
          {LABELS.message}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          disabled={busy}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={fieldClass("message")}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-2 text-xs text-terrakotta" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* The transport failed. Nothing typed is lost, and the direct path is
          offered rather than a confirmation that would not be true. */}
      {status === "failed" && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 border border-terrakotta/50 px-5 py-4 text-sm leading-relaxed text-cream/80 focus:outline-none"
        >
          Ihre Anfrage konnte nicht zugestellt werden — sie ist <strong className="font-semibold text-cream">nicht</strong>{" "}
          bei uns angekommen. Ihre Eingaben bleiben erhalten: bitte erneut senden, oder direkt schreiben an{" "}
          <a href={mailtoFallback()} data-cursor className="link-underline text-gold">
            {brand.contactEmail}
          </a>
          .
        </p>
      )}

      <button type="submit" data-cursor disabled={busy} className="btn-primary mt-8 disabled:opacity-60">
        {busy ? "Wird gesendet …" : "Anfrage senden"} <span aria-hidden>&rarr;</span>
      </button>
    </form>
  );
}
