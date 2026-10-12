/**
 * The partner-logo strip under the reference hero, carried over as what this
 * house actually has instead of partners: the facts of the place. Every item
 * is stated in lib/content.
 */
const FACTS = [
  "Salbuch 1464",
  "Kitzbühel · 760 m ü. A.",
  "Ein Osthang",
  "Artesische Quelle · 7 °C",
  "47 Bäume",
  "Kothe-Kupferanlage",
  "Mind. 36 Monate im Glas",
];

export function FmProvenanceStrip() {
  return (
    <section aria-label="Herkunft in Stichworten" className="bg-fm-night text-fm-beige/70">
      <ul className="fm-up mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-7 text-[0.64rem] tracking-[0.16em] lg:py-8">
        {FACTS.map((f) => (
          <li
            key={f}
            className="flex items-center gap-x-10 before:h-1 before:w-1 before:rounded-full before:bg-fm-copper first:before:hidden"
          >
            {f}
          </li>
        ))}
      </ul>
    </section>
  );
}
