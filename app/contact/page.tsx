export const metadata = { title: "Visit — 1464byW" };

export default function ContactPage() {
  return (
    <div className="pt-32 pb-32 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="signage text-gold mb-4">Visit</p>
      <h1 className="display text-5xl md:text-7xl text-cream leading-tight mb-12">
        Kommen Sie. Es ist still hier.
      </h1>
      <div className="grid md:grid-cols-2 gap-12 mt-16">
        <div>
          <p className="signage text-gold mb-4">Hof</p>
          <p className="text-cream/80 leading-relaxed">
            Warmbachhof<br />
            Kitzbühel, Tirol<br />
            Österreich
          </p>
          <p className="text-stone text-sm mt-4">Sichtachse zum Wilden Kaiser. Brennerei innerhalb der Stadtgrenzen Kitzbühels.</p>
        </div>
        <div>
          <p className="signage text-gold mb-4">Concierge</p>
          <p className="text-cream/80 leading-relaxed">
            concierge@warmbachhof.com<br />
            Reservierung Tasting (40 Sitzplätze)<br />
            Gästehaus Reith — auf Anfrage
          </p>
        </div>
      </div>
      <form className="mt-20 border-t border-hairline/20 pt-12">
        <p className="signage text-gold mb-6">Anfrage</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input placeholder="Name" className="bg-soot border border-hairline/30 px-4 py-3 focus:outline-none focus:border-gold" />
          <input type="email" placeholder="E-Mail" className="bg-soot border border-hairline/30 px-4 py-3 focus:outline-none focus:border-gold" />
        </div>
        <textarea placeholder="Anlass — Tasting, Patron Cask, Gästehaus, Sonstiges" rows={5} className="w-full bg-soot border border-hairline/30 px-4 py-3 focus:outline-none focus:border-gold" />
        <button className="btn-primary mt-6">Anfrage senden →</button>
      </form>
    </div>
  );
}
