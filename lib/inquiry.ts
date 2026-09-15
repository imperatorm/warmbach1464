/**
 * The shape of everything the concierge can receive. Two surfaces write to it:
 * the contact form (`kind: "contact"`) and the membership candidacy form
 * (`kind: "membership"`). Validation lives here so the client and the route
 * handler agree on what a complete submission is — the client's copy is a
 * courtesy, the server's is the one that decides.
 */
export type InquiryKind = "contact" | "membership";

export type InquiryPayload = {
  kind: InquiryKind;
  name: string;
  email: string;
  /** contact: the message. membership: the "Über Sie" paragraph. */
  message?: string;
  phone?: string;
  source?: string;
  more?: string;
  /** membership: the three answers, in order. */
  answers?: string[];
};

export type InquiryFieldError = { field: string; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Server-authoritative validation. Returns [] when the submission is complete. */
export function validateInquiry(input: Partial<InquiryPayload>): InquiryFieldError[] {
  const errors: InquiryFieldError[] = [];
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();

  if (!name) errors.push({ field: "name", message: "Bitte Ihren Namen angeben." });
  if (!EMAIL.test(email))
    errors.push({ field: "email", message: "Bitte eine gültige E-Mail-Adresse angeben." });

  if (input.kind === "contact") {
    if ((input.message ?? "").trim().length < 10)
      errors.push({ field: "message", message: "Bitte Ihr Anliegen in ein, zwei Sätzen beschreiben." });
  }

  if (input.kind === "membership") {
    const answers = input.answers ?? [];
    for (let i = 0; i < 3; i += 1) {
      if ((answers[i] ?? "").trim().length < 10)
        errors.push({ field: `q${i + 1}`, message: "Bitte beantworten Sie diese Frage." });
    }
  }

  return errors;
}

/** The concierge-readable rendering of a submission. */
export function formatInquiry(p: InquiryPayload): { subject: string; text: string } {
  const lines: string[] = [];
  lines.push(`Name: ${p.name.trim()}`);
  lines.push(`E-Mail: ${p.email.trim()}`);
  if (p.phone?.trim()) lines.push(`Telefon: ${p.phone.trim()}`);
  if (p.source?.trim()) lines.push(`Gehört über: ${p.source.trim()}`);
  if (p.more?.trim()) lines.push(`Weitere Angaben: ${p.more.trim()}`);
  if (p.message?.trim()) lines.push("", p.kind === "membership" ? "Über die Person:" : "Anliegen:", p.message.trim());
  p.answers?.forEach((a, i) => {
    if (a?.trim()) lines.push("", `Frage ${i + 1}:`, a.trim());
  });

  const subject =
    p.kind === "membership"
      ? `Kandidatur — ${p.name.trim()}`
      : `Anfrage über warmbachhof.com — ${p.name.trim()}`;

  return { subject, text: lines.join("\n") };
}
