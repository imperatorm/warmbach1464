import { Reveal } from "@/components/ui/Reveal";

/**
 * The plain-spoken intro band (Escape: "And at Escape, that one thing was
 * always coffee…") — one paragraph, no headline, generous whitespace.
 */
export function IntroBand() {
  return (
    <section className="bg-kalk px-6 py-24 text-night lg:px-16 lg:py-32">
      <Reveal>
        <p className="max-w-3xl font-body text-xl leading-relaxed text-night/85 lg:text-2xl">
          Wie beim Wein entscheidet der Boden — worauf die Bäume stehen, schmeckt man
          später. Der Hof ist kein Etikett, er ist der Ort: eine Quelle, ein Osthang,
          siebenundvierzig Bäume. Seit 1464, urkundlich verbürgt.
        </p>
      </Reveal>
    </section>
  );
}
