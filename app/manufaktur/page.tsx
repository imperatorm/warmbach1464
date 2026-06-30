/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarNext } from "@/components/sections/PillarShell";

// Kothe-Brennanlage — belegt aus dem Look-&-Feel-Deck (Folie 4) / docs/substance-dossier.md
const kotheSpecs = [
  { label: "Anlage", value: "Kothe Destillationstechnik" },
  { label: "Kupferschicht", value: "Katalytisch, 2,0 m²" },
  { label: "Kolonne", value: "Seitlich, 3 Umkehrkochböden" },
  { label: "Brennblase", value: "Kupfer, hohe Kesselbrust" },
  { label: "Kühlung", value: "Rohrbündelkühler, Edelstahl-Wasserbad" },
  { label: "Brand", value: "Doppelt, handverlesen, filtriert" },
];

export const metadata = {
  title: "Manufaktur — 1464byW",
  description:
    "Kupfer und Feuer. Die Kothe-Kupferanlage und der schonende Zweifachbrand am Warmbachhof — perfekte Balance aus Technik, Natur und Zeit.",
};

export default function ManufakturPage() {
  return (
    <div>
      {/* Hero — bild-geführt wie im green-Projekt */}
      <section className="relative flex min-h-[86vh] items-end overflow-hidden px-6 pb-20 pt-40 lg:px-10">
        <img
          src="/gallery/warmbach/img_0068.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-night/74" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-night/70" />
        <div className="relative mx-auto w-full max-w-[1400px]">
          <Reveal>
            <p className="t-label mb-7 text-gold">Säule IV</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="t-display text-cream">Manufaktur</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="t-h3 mt-7 max-w-2xl italic text-cream/85">Kupfer und Feuer.</p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="t-lead mt-8 max-w-2xl">
              Perfekte Balance aus Technik, Natur und Zeit. Die Kothe-Kupferanlage und der schonende
              Zweifachbrand — hier wird aus der Frucht des Hofs der erste eigene Edelbrand. Brennmeister:
              René Dubitzky.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Kapitel i — Das Kupfer */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
          <Reveal className="lg:col-span-5">
            <img
              src="/gallery/warmbach/img_0070.jpg"
              alt="Der kupferne Kothe-Brennkessel im Brennraum des Warmbachhofs"
              className="w-full border border-copper/20 object-cover"
              loading="lazy"
            />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-5">Kapitel i · Das Kupfer</p>
            <h2 className="t-h1 mb-6 text-night">Das Metall dieses Tals.</h2>
            <p className="t-lead mb-8 max-w-md !text-night/70">
              Die Kothe-Anlage ist die Hauptdarstellerin der Manufaktur — und sie schlägt den Bogen zum
              Boden: Kupfer ist das Metall dieses Tals, vom Erz im Schiefer zum Spiegel der Brennblase.
            </p>
            <dl className="grid grid-cols-1 gap-px overflow-hidden border border-copper/20 bg-copper/20 sm:grid-cols-2">
              {kotheSpecs.map((s) => (
                <div key={s.label} className="card-field p-6">
                  <dt className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta">{s.label}</dt>
                  <dd className="mt-2 text-cream">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Full-bleed Brennraum-Band */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden border-t border-hairline/10">
        <img
          src="/gallery/warmbach/img_0087.jpg"
          alt="Brennraum des Warmbachhofs mit Kothe-Kupferanlage"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/15 to-night/30" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-10">
          <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6">
            <p className="t-label text-cream/90">Die Brennerei · Kothe-Kupferanlage</p>
            <Link href="/galerie" data-cursor className="link-underline text-xs uppercase tracking-[0.18em] text-cream/80">
              Galerie &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Kapitel ii — Das Feuer (Brennprozess) */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-5">Kapitel ii · Das Feuer</p>
            <h2 className="t-h1 mb-6 max-w-2xl text-night">Schonend. Doppelt. Von Hand.</h2>
            <p className="t-lead max-w-2xl !text-night/70">
              Zweifachbrand auf der Kothe-Kupferanlage, handverlesen und filtriert. Einmaischen, schonende
              Erhitzung, der Engschnitt im Herzstück. Eine Balance aus Technik, Natur und Zeit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Kapitel iii — Feuer als Katalysator und Säule des Brandes (kritisch) */}
      <section className="bg-kalk px-6 py-24 text-night lg:px-10 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
          <Reveal className="lg:col-span-6">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-5">Kapitel iii · Der kritische Moment</p>
            <h2 className="t-h1 mb-6 text-night">Feuer — Katalysator und Säule des Brandes.</h2>
            <p className="t-lead mb-6 max-w-md !text-night/70">
              Das Feuer fügt keinen Geschmack hinzu — es offenbart ihn. Als Katalysator treibt die
              kontrollierte Hitze unter der Kupferblase die Verwandlung: aus Maische wird Geist. Ohne
              Feuer kein Brand.
            </p>
            <p className="text-base leading-relaxed text-night/70">
              Und es ist der kritischste Moment des Hauses. Im Engschnitt trennt die Hand des
              Brennmeisters den Vorlauf vom Herzstück — dort entscheidet sich, was bleibt. Genau diese
              Sorgfalt hält die Methanolwerte unter den Grenzen der VO (EU) 2019/787. So trägt das Feuer
              den Brand: die Kraft, die verwandelt, und die Verantwortung, die schützt.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <img
              src="/gallery/warmbach/img_0083.jpg"
              alt="Glut und Kupferreflexe im Brennraum des Warmbachhofs"
              className="w-full border border-copper/20 object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-kalk px-6 py-24 text-center text-night lg:py-32">
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.22em] text-terrakotta mb-6">Aus diesem Hof</p>
          <p className="t-h2 mb-12 text-night">Was wir brennen, brennen wir einmal.</p>
          <Link href="/editions" data-cursor className="btn-primary !text-night">
            Die Editionen <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>
      </section>

      <PillarNext current="manufaktur" />
    </div>
  );
}
