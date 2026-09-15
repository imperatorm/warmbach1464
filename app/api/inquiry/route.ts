import { NextResponse } from "next/server";
import { brand } from "@/lib/content";
import { formatInquiry, validateInquiry, type InquiryPayload } from "@/lib/inquiry";

export const runtime = "nodejs";

/**
 * The one door every inquiry goes through — the concierge form and the
 * membership candidacy both POST here.
 *
 * Transport is Resend, configured by RESEND_API_KEY. When that key is absent
 * the route answers 503 and the form says so: a submission is never reported
 * as delivered unless the transport confirmed it. Silence is the one thing
 * this endpoint must never return as success.
 */
export async function POST(request: Request) {
  let body: Partial<InquiryPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.kind !== "contact" && body.kind !== "membership")
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });

  const errors = validateInquiry(body);
  if (errors.length > 0) return NextResponse.json({ errors }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "transport_unconfigured" },
      { status: 503 },
    );

  const { subject, text } = formatInquiry(body as InquiryPayload);
  const from = process.env.INQUIRY_FROM ?? `1464byW <no-reply@${brand.domain}>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [process.env.INQUIRY_TO ?? brand.contactEmail],
        reply_to: (body.email ?? "").trim(),
        subject,
        text,
      }),
    });

    if (!res.ok) {
      console.error("[inquiry] transport rejected", res.status, await res.text());
      return NextResponse.json({ error: "transport_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[inquiry] transport error", err);
    return NextResponse.json({ error: "transport_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
