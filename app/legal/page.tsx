export const metadata = { title: "Legal — 1464byW" };

export default function LegalPage() {
  return (
    <div className="pt-32 pb-32 px-6 lg:px-12 max-w-3xl mx-auto text-cream/85 leading-relaxed">
      <p className="signage text-gold mb-4">Legal</p>
      <h1 className="display text-4xl text-cream mb-12">Impressum · Datenschutz · Altersbestätigung</h1>

      <h2 id="impressum" className="display text-2xl text-cream mt-12 mb-4">Impressum</h2>
      <p>
        WARMBACHHOF · Kitzbühel, Tirol, Österreich.
        Inhaber: Familie Dr. Hans Wehrmann. Vertreten durch: Geschäftsführung Hofbüro.
        Markenrechtliche Vertretung: Certina IP AG, Grünwald.
        UID-Nummer: in Anmeldung. Aufsichtsbehörde: BH Kitzbühel.
        Kontakt: concierge@warmbachhof.com.
      </p>

      <h2 id="privacy" className="display text-2xl text-cream mt-12 mb-4">Datenschutz</h2>
      <p>
        Wir erheben personenbezogene Daten nach DSGVO ausschließlich zur Vertragserfüllung und für die Kommunikation
        mit Interessenten und Mitgliedern. Diese Website verwendet keine Analyse- oder Tracking-Tools und keine
        Drittanbieter-Cookies. Technisch notwendig setzen wir lediglich ein Erstanbieter-Cookie für den
        passwortgeschützten Zugang (wbz_access, Speicherdauer 30 Tage); zusätzlich wird Ihre Altersbestätigung
        lokal auf Ihrem Gerät gespeichert (localStorage). Eine darüber hinausgehende Auswertung findet nicht statt.
      </p>

      <h2 id="age" className="display text-2xl text-cream mt-12 mb-4">Altersbestätigung</h2>
      <p>
        Der Verkauf alkoholischer Erzeugnisse erfolgt ausschließlich an Volljährige (Mindestalter 18 Jahre).
        Mit der Bestätigung des Geburtsdatums versichern Sie die Wahrheit Ihrer Angabe.
      </p>

      <h2 className="display text-2xl text-cream mt-12 mb-4">Verantwortungsvoller Genuss</h2>
      <p>
        1464byW steht für bewussten Genuss. Schwangere und Stillende sollten auf den Konsum von Alkohol verzichten.
        Genuss in Maßen ist ein Privileg — und ein Versprechen an die nächste Generation.
      </p>
    </div>
  );
}
