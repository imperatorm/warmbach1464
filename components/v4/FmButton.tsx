import Link from "next/link";

type Tone = "outline-beige" | "solid-beige" | "outline-night" | "solid-night";

const TONES: Record<Tone, string> = {
  "outline-beige":
    "border-fm-beige/60 text-fm-beige hover:border-fm-beige hover:bg-fm-beige hover:text-fm-night",
  "solid-beige":
    "border-fm-beige bg-fm-beige text-fm-night hover:border-fm-copper hover:bg-fm-copper hover:text-fm-beige",
  "outline-night":
    "border-fm-night/40 text-fm-night hover:border-fm-night hover:bg-fm-night hover:text-fm-beige",
  "solid-night": "border-fm-night bg-fm-night text-fm-beige hover:border-fm-moss hover:bg-fm-moss",
};

/**
 * The reference has one button: a hairline pill, a small-caps label, a dot
 * on either side of the word. Outline by default; it fills on hover.
 */
export function FmButton({
  href,
  children,
  tone = "outline-beige",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-cursor
      className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-6 text-[0.66rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${TONES[tone]} ${className}`}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
      {children}
      <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
    </Link>
  );
}
