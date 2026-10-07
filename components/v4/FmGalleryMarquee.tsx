import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { FmButton } from "./FmButton";

const SHOTS = [
  { src: "/gallery/warmbach/img_0027.jpg", alt: "Der Hof vor dem Wilden Kaiser", cap: "Der Hof · Osthang" },
  { src: "/gallery/warmbach/img_0065.jpg", alt: "Die Bar im Warmbachhof", cap: "Die Bar" },
  { src: "/gallery/warmbach/img_0080.jpg", alt: "Die Kothe-Brennblase", cap: "Die Brennerei" },
  { src: "/gallery/warmbach/img_0096.jpg", alt: "Die Holztreppe im Kupferlicht", cap: "Warmbach Lounge" },
  { src: "/gallery/warmbach/img_0041.jpg", alt: "Geschnitzte Balkone des Warmbachhofs", cap: "Die Balkone" },
  { src: "/gallery/warmbach/img_6648.jpg", alt: "Das W-Monogramm auf Altholz", cap: "Das Zeichen" },
];

function Card({ s, hidden = false }: { s: (typeof SHOTS)[number]; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined} className="w-[72vw] shrink-0 sm:w-[400px]">
      <Link
        href="/galerie"
        data-cursor
        tabIndex={hidden ? -1 : undefined}
        className="group block overflow-hidden rounded-[4px] bg-fm-sand"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={s.src}
            alt={hidden ? "" : s.alt}
            fill
            sizes="(min-width: 640px) 400px, 72vw"
            className="object-cover transition-transform duration-700 ease-deep group-hover:scale-[1.04]"
          />
        </div>
        <p className="fm-up flex items-center justify-between p-4 text-[0.64rem] tracking-[0.12em] text-fm-night/75">
          {s.cap}
          <span aria-hidden>&rarr;</span>
        </p>
      </Link>
    </li>
  );
}

/**
 * The reference blog marquee, as the estate gallery: a slow endless track of
 * photographs that pauses under the pointer and stands still under reduced
 * motion (the gallery-flow keyframes already honour it).
 */
export function FmGalleryMarquee() {
  return (
    <section className="overflow-hidden bg-fm-beige py-24 text-fm-night lg:py-32">
      <Reveal className="mx-auto flex max-w-[1500px] flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-10">
        <h2 className="fm-h text-[clamp(2.2rem,4.4vw,4.4rem)] text-fm-moss">
          Hof, Bar,
          <br />
          Brennerei.
        </h2>
        <FmButton href="/galerie" tone="outline-night">
          Die Galerie
        </FmButton>
      </Reveal>

      <ul className="gallery-flow mt-14 flex w-max gap-4 pl-6 lg:pl-10">
        {SHOTS.map((s) => (
          <Card key={s.src} s={s} />
        ))}
        {SHOTS.map((s) => (
          <Card key={`${s.src}-dup`} s={s} hidden />
        ))}
      </ul>
    </section>
  );
}
