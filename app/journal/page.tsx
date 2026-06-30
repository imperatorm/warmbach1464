export const metadata = { title: "Journal — 1464byW" };

const entries = [
  { date: "Mai 2026", title: "Inbetriebnahme Kothe", excerpt: "Die 100-Liter-Blase läuft. Erste Maische heute Mittag. Dubitzky hat den Schnitt." },
  { date: "April 2026", title: "Eintragung W// beim DPMA", excerpt: "Wortmarke registriert, Reg.-Nr. 30 2026 207 672. Klassen 03/31/32/33." },
  { date: "März 2026", title: "Pomologie — Reiser am Osthang", excerpt: "Hans Schiefer hat sechzehn Reiser des Urstocks gepfropft. Klosterneuburg läuft an." },
];

export default function JournalPage() {
  return (
    <div>
      {/* Dark entry — title block (Fassade rhythm: dark hero → light body) */}
      <div className="pt-32 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
        <p className="signage text-gold mb-4">Journal</p>
        <h1 className="display text-5xl md:text-7xl text-cream leading-tight">
          Was am Hof passiert,
          <br />schreiben wir auf.
        </h1>
      </div>

      {/* Light kalk body — the entries as soot card-field tiles */}
      <section className="bg-kalk px-6 py-16 text-night lg:px-12 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <ul className="grid gap-5 md:grid-cols-3">
            {entries.map(e => (
              <li key={e.title} className="card-field group flex h-full flex-col p-7">
                <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-2">{e.date}</p>
                <h2 className="display text-3xl text-cream transition-colors group-hover:text-terrakotta mb-3">{e.title}</h2>
                <p className="text-cream/70 leading-relaxed">{e.excerpt}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
