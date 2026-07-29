import Link from "next/link";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";

/** Small line icons — inlined rather than pulling in an icon dependency. */
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * Manifest — the kalk sheet that lifts over the film on rounded corners
 * (Drift's about band): a short centred claim with two pill doors, a hairline
 * divider pinned by two dots, then the house statement at reading-poster
 * scale beside the monogram.
 */
export function ManifestBand() {
  return (
    <section className="relative z-10 rounded-t-[28px] bg-kalk px-6 py-20 text-night md:py-32">
      {/* Top — the claim and the two doors */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-9">
        <Reveal>
          <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">
            ( 01 ) Manifest
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="max-w-lg text-center text-base leading-relaxed text-night/80 md:text-lg">
            Wir haben nichts erfunden. Wir haben es nur wiedergefunden — einen Hof, der
            seit 562 Jahren ununterbrochen bewirtschaftet wird.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              data-cursor
              className="group inline-flex items-center gap-3 rounded-full bg-night py-1.5 pl-1.5 pr-6 text-cream transition-colors duration-300 hover:bg-merlot"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-night">
                <MailIcon />
              </span>
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em]">Besuch anfragen</span>
            </Link>
            <Link
              href="/journal"
              data-cursor
              className="group inline-flex items-center gap-3 rounded-full bg-night/10 py-1.5 pl-1.5 pr-6 text-night transition-colors duration-300 hover:bg-night/20"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-night">
                <PlusIcon />
              </span>
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.14em]">Journal lesen</span>
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Divider — dot, rule, dot */}
      <div className="mx-auto mt-20 flex max-w-[1500px] items-center gap-1 md:mt-28">
        <span className="h-2 w-2 rounded-full bg-night/25" />
        <span className="h-[2px] flex-1 bg-night/25" />
        <span className="h-2 w-2 rounded-full bg-night/25" />
      </div>

      {/* Bottom — the statement */}
      <div className="mx-auto mt-16 flex max-w-[1500px] flex-col gap-12 md:flex-row md:gap-20">
        <Reveal className="shrink-0">
          <Monogram variant="dark" className="h-10 w-auto" />
          <p className="mt-4 text-[0.65rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-terrakotta">
            Boden
            <br />
            Verbürgt
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="t-hero max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.3] text-night">
            Sechsundzwanzig Generationen haben diesen Osthang gehalten, bevor wir zum
            ersten Mal selbst gebrannt haben. Der Hof ist kein Etikett — er ist der Ort,
            und was darauf wächst, schmeckt man später in der Flasche.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
