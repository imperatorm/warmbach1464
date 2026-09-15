import Link from "next/link";

const STUDIES = [
  { href: "/galerie/tisch", label: "Der Tisch" },
  { href: "/galerie/hang", label: "Der Hang" },
  { href: "/galerie/kammer", label: "Die Kammer" },
] as const;

/**
 * The three gallery studies are alternatives to each other, not chapters —
 * this bar exists so they can be compared side by side before one is chosen.
 * It rides on the study routes only; the live gallery never shows it.
 */
export function StudySwitch({ current }: { current: string }) {
  return (
    <nav
      aria-label="Galerie-Entwürfe"
      // Out of the composition's way on both axes: a compact strip under the
      // header on a phone, a rail on the right edge where there is room.
      className="fixed right-3 top-[5.1rem] z-[70] flex items-center gap-1 rounded-full border border-night/10 bg-cream/85 p-1 backdrop-blur-md lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col lg:items-stretch lg:rounded-[22px]"
    >
      <span className="hidden px-3 pb-1 pt-2 text-center text-[0.5rem] uppercase tracking-[0.2em] text-night/35 lg:block">
        Entwurf
      </span>
      {STUDIES.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          data-cursor
          aria-current={s.href === current ? "page" : undefined}
          className={`inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 text-[0.55rem] uppercase tracking-[0.14em] transition-colors duration-300 lg:px-4 lg:text-[0.6rem] lg:tracking-[0.18em] ${
            s.href === current ? "bg-night text-cream" : "text-night/55 hover:text-night"
          }`}
        >
          {s.label}
        </Link>
      ))}
    </nav>
  );
}
