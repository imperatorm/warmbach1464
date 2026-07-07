import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { PillarHeroV3, PillarNextV3 } from "@/components/sections/PillarShellV3";
import { NumberedSection } from "@/components/v3/NumberedSection";
import { BlueprintShowcase } from "@/components/v3/BlueprintShowcase";
import { CollageFeatureList } from "@/components/v3/CollageFeatureList";
import { pillars } from "@/lib/content";

const pillar = pillars.find((p) => p.slug === "manufaktur")!;

// Kothe-Brennanlage — belegt aus dem Look-&-Feel-Deck (Folie 4) / docs/substance-dossier.md
const kotheSpecs = [
  { label: "Anlage", value: "Kothe Destillationstechnik" },
  { label: "Kupferschicht", value: "Katalytisch, 2,0 m²" },
  { label: "Kolonne", value: "Seitlich, 3 Umkehrkochböden" },
  { label: "Brennblase", value: "Kupfer, hohe Kesselbrust" },
  { label: "Kühlung", value: "Rohrbündelkühler, Edelstahl-Wasserbad" },
  { label: "Brand", value: "Doppelt, handverlesen, filtriert" },
];

const brennImages = [
  { src: "/gallery/warmbach/img_0068.jpg", alt: "Der Brennraum mit der Kothe-Anlage" },
  { src: "/gallery/warmbach/img_0077.jpg", alt: "Kupferdetails der Brennanlage" },
  { src: "/gallery/warmbach/img_0073.jpg", alt: "Armaturen der Kothe-Anlage" },
  { src: "/gallery/warmbach/img_0087.jpg", alt: "Der Brennraum im Ganzen" },
  { src: "/gallery/warmbach/img_0078.jpg", alt: "Die Kolonne der Brennanlage" },
  { src: "/gallery/warmbach/img_0083.jpg", alt: "Glut und Kupferreflexe" },
  { src: "/gallery/warmbach/img_0074.jpg", alt: "Der Kühler der Anlage" },
  { src: "/gallery/warmbach/img_0070.jpg", alt: "Die kupferne Brennblase" },
];

export const metadata = {
  title: "Manufaktur — 1464byW",
  description:
    "Kupfer und Feuer. Die Kothe-Kupferanlage und der schonende Zweifachbrand am Warmbachhof — perfekte Balance aus Technik, Natur und Zeit.",
};

/**
 * Säule IV — Manufaktur, v3 (Watchibia blueprint pattern): the Kothe still
 * inside crosshair registration marks with technical annotations, numbered
 * process chapters, and the dark collage band of the Brennraum.
 */
export default function ManufakturPage() {
  return (
    <div>
      <PillarHeroV3 pillar={pillar} />

      <BlueprintShowcase
        titleA="Kupfer und Feuer."
        titleB="Die Kothe-Anlage."
        image={{ src: "/gallery/warmbach/img_0070.jpg", alt: "Der kupferne Kothe-Brennkessel im Brennraum" }}
        annotations={[
          { text: "Katalytische Kupferschicht — 2,0 m².", side: "left", top: "16%" },
          { text: "Seitliche Kolonne mit drei Umkehrkochböden.", side: "right", top: "30%" },
          { text: "Brennblase aus Kupfer, hohe Kesselbrust.", side: "left", top: "52%" },
          { text: "Rohrbündelkühler im Edelstahl-Wasserbad.", side: "right", top: "70%" },
        ]}
        caption="Kupfer ist das Metall dieses Tals — vom Erz im Schiefer zum Spiegel der Brennblase."
        tone="kalk"
      />

      <NumberedSection
        no="01"
        title="Das Kupfer"
        intro="Die Kothe-Anlage ist die Hauptdarstellerin der Manufaktur — und sie schlägt den Bogen zum Boden: Kupfer ist das Metall dieses Tals, vom Erz im Schiefer zum Spiegel der Brennblase."
        tone="kalk"
      >
        <dl className="grid grid-cols-1 gap-px overflow-hidden border border-copper/25 bg-copper/25 sm:grid-cols-2 lg:grid-cols-3">
          {kotheSpecs.map((s) => (
            <div key={s.label} className="bg-cream p-6">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-terrakotta">{s.label}</dt>
              <dd className="mt-2 text-night">{s.value}</dd>
            </div>
          ))}
        </dl>
      </NumberedSection>

      <NumberedSection
        no="02"
        title="Das Feuer"
        intro="Zweifachbrand auf der Kothe-Kupferanlage, handverlesen und filtriert. Einmaischen, schonende Erhitzung, der Engschnitt im Herzstück. Eine Balance aus Technik, Natur und Zeit."
        tone="cream"
      />

      <CollageFeatureList
        titleA="Vier Schritte,"
        titleB="ein Brand."
        features={[
          { label: "Einmaischen", desc: "Standortgerechte Früchte des Hofs, von Hand verlesen." },
          { label: "Zweifachbrand", desc: "Schonend auf der Kothe-Kupferanlage — Technik, Natur und Zeit in Balance." },
          { label: "Engschnitt", desc: "Die Hand des Brennmeisters trennt den Vorlauf vom Herzstück — dort entscheidet sich, was bleibt." },
          { label: "Reife", desc: "Mindestens 36 Monate Stille im Glasballon. Ohne Holz, ohne Korrektur." },
        ]}
        images={brennImages}
      />

      <NumberedSection
        no="03"
        title="Der kritische Moment"
        intro="Das Feuer fügt keinen Geschmack hinzu — es offenbart ihn. Im Engschnitt trennt die Hand des Brennmeisters den Vorlauf vom Herzstück. Genau diese Sorgfalt hält die Methanolwerte unter den Grenzen der VO (EU) 2019/787: die Kraft, die verwandelt, und die Verantwortung, die schützt."
        tone="cream"
      >
        <Reveal className="text-center">
          <p className="mb-8 font-display text-xl italic text-night/70">Was wir brennen, brennen wir einmal.</p>
          <Link href="/editions" data-cursor className="btn-primary !text-night">
            Die Editionen <span aria-hidden>&rarr;</span>
          </Link>
        </Reveal>
      </NumberedSection>

      <PillarNextV3 current="manufaktur" />
    </div>
  );
}
