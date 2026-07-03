type Tone = "light" | "dark";

/**
 * Running chapter header — the print-sheet folio line that opens every
 * editorial section of the v2 landing page: "( 01 ) Manifest ——— aside".
 */
export function ChapterHead({
  no,
  title,
  aside,
  tone = "light",
}: {
  no: string;
  title: string;
  aside?: string;
  tone?: Tone;
}) {
  const ink = tone === "light" ? "text-night" : "text-cream";
  const rule = tone === "light" ? "border-copper/30" : "border-hairline/20";
  const meta = tone === "light" ? "text-copper" : "text-gold";

  return (
    <div className={`mb-14 border-b ${rule} pb-5 lg:mb-20`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <div className="flex items-baseline gap-4 lg:gap-6">
          <span className={`font-body text-[0.7rem] font-medium tracking-[0.22em] ${meta}`}>( {no} )</span>
          <h2 className={`font-display text-2xl leading-none lg:text-3xl ${ink}`}>{title}</h2>
        </div>
        {aside && (
          <p className={`font-body text-[0.65rem] uppercase tracking-[0.22em] ${meta}`}>{aside}</p>
        )}
      </div>
    </div>
  );
}
