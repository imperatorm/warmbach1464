import { Monogram } from "@/components/ui/Monogram";
import { EnterForm } from "@/components/ui/EnterForm";

export const metadata = {
  title: "1464 by W — Privater Zugang",
  robots: { index: false, follow: false },
};

export default function EnterPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  const from =
    typeof searchParams.from === "string" && searchParams.from.startsWith("/")
      ? searchParams.from
      : "/";

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-night px-6">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,126,91,0.10),_transparent_60%)]" />

      <div className="relative w-full max-w-sm text-center">
        <Monogram className="mx-auto mb-9 h-14 w-14" />
        <p className="t-label mb-5">Privater Zugang</p>
        <h1
          aria-label="1464 by W"
          className="flex items-center justify-center gap-3 font-display text-4xl leading-none text-cream [font-variation-settings:'opsz'_90]"
        >
          <span aria-hidden="true">1464</span>
          <span aria-hidden="true" className="italic text-gold">by</span>
          <span aria-hidden="true">
            <Monogram className="h-9 w-auto" />
          </span>
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-stone">
          Diese Vorschau ist geschützt. Bitte geben Sie Ihr Passwort ein.
        </p>

        <EnterForm from={from} />

        <p className="mt-10 text-xs leading-relaxed text-stone/55">
          Kein Zugang? Wenden Sie sich an die Familie Wehrmann.
        </p>
      </div>
    </div>
  );
}
