import { Reveal } from "@/components/ui/Reveal";

type Tone = "cream" | "kalk" | "night" | "merlot";

const TONES: Record<Tone, { bg: string; ink: string; meta: string; rule: string; body: string }> = {
  cream: { bg: "bg-cream", ink: "text-night", meta: "text-copper", rule: "border-copper/40", body: "text-night/70" },
  kalk: { bg: "bg-kalk", ink: "text-night", meta: "text-copper", rule: "border-copper/40", body: "text-night/70" },
  night: { bg: "bg-night", ink: "text-cream", meta: "text-gold", rule: "border-gold/40", body: "text-cream/65" },
  merlot: { bg: "bg-merlot", ink: "text-cream", meta: "text-gold", rule: "border-gold/40", body: "text-cream/65" },
};

/**
 * Fortress-style numbered section: a small underlined index (01), a big
 * uppercase grotesk headline, an optional narrow intro, then free children.
 * The v3 successor to ChapterHead — used on the home and inside pillar bodies.
 */
export function NumberedSection({
  no,
  title,
  intro,
  tone = "cream",
  centered = false,
  children,
  className = "",
}: {
  no: string;
  title: string;
  intro?: string;
  tone?: Tone;
  centered?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <section className={`${t.bg} ${t.ink} px-6 py-20 lg:px-10 lg:py-28 ${className}`}>
      <div className={`mx-auto max-w-[1400px] ${centered ? "text-center" : ""}`}>
        <Reveal>
          <span className={`inline-block border-b ${t.rule} pb-1 font-body text-[0.72rem] font-semibold tracking-[0.08em] ${t.meta}`}>
            {no}
          </span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className={`mt-6 font-body text-[clamp(1.7rem,3.6vw,2.9rem)] font-semibold uppercase leading-[1.12] tracking-[0.01em] ${t.ink} ${centered ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
            {title}
          </h2>
        </Reveal>
        {intro && (
          <Reveal delay={0.12}>
            <p className={`mt-6 text-base leading-relaxed lg:text-lg ${t.body} ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
              {intro}
            </p>
          </Reveal>
        )}
        {children && <div className="mt-12 lg:mt-16">{children}</div>}
      </div>
    </section>
  );
}
