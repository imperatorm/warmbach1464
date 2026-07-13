"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { heritageElements } from "@/lib/content";

const ELEMENT_IMAGES: Record<string, { src: string; alt: string }> = {
  Boden: { src: "/gallery/warmbach/img_0024.jpg", alt: "Wiese vor dem Wilden Kaiser" },
  Wasser: { src: "/gallery/warmbach/img_0059.jpg", alt: "Der Hof in der Winterdämmerung" },
  Baum: { src: "/gallery/warmbach/img_0030.jpg", alt: "Der Osthang über Kitzbühel" },
  Kupfer: { src: "/gallery/warmbach/img_0080.jpg", alt: "Die kupferne Kothe-Brennblase" },
  Zeit: { src: "/gallery/warmbach/img_6648.jpg", alt: "Das W-Monogramm auf Altholz" },
};

/**
 * The five elements as Osmo "Sticky Steps": text steps on the left, one
 * sticky visual on the right that swaps as each step's anchor crosses the
 * viewport centre. Status logic and data-attributes follow the Osmo resource;
 * only content and skin are ours. On <992px the CSS stacks steps linearly.
 */
export function ElementSteps() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = [...container.querySelectorAll("[data-sticky-steps-item]")];
    if (!items.length) return;

    function updateSteps() {
      const viewportCenter = window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      items.forEach((item, index) => {
        const anchor = item.querySelector("[data-sticky-steps-anchor]");
        if (!anchor) return;

        const rect = anchor.getBoundingClientRect();
        const anchorCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - anchorCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      items.forEach((item, index) => {
        let status = "active";

        if (index < closestIndex) status = "before";
        if (index > closestIndex) status = "after";

        item.setAttribute("data-sticky-steps-item-status", status);
      });
    }

    window.addEventListener("scroll", updateSteps);
    window.addEventListener("resize", updateSteps);
    requestAnimationFrame(updateSteps);

    return () => {
      window.removeEventListener("scroll", updateSteps);
      window.removeEventListener("resize", updateSteps);
    };
  }, []);

  return (
    <section className="sticky-steps bg-cream text-night">
      <div className="sticky-steps__container">
        <div data-sticky-steps-init ref={ref} className="sticky-steps__collection">
          <div className="sticky-steps__list">
            {heritageElements.map((el, i) => {
              const img = ELEMENT_IMAGES[el.name] ?? ELEMENT_IMAGES.Zeit;
              return (
                <div
                  key={el.name}
                  data-sticky-steps-item
                  data-sticky-steps-item-status={i === 0 ? "active" : "after"}
                  className="sticky-steps__item"
                >
                  <div data-sticky-steps-anchor className="sticky-steps__text">
                    <span className="sticky-steps__eyebrow">
                      {el.no} · {el.data}
                    </span>
                    <h3 className="sticky-steps__h2">{el.name}</h3>
                    <p className="sticky-steps__p">{el.body}</p>
                  </div>
                  <div className="sticky-steps__media">
                    <div className="sticky-steps__sticky">
                      <div className="sticky-steps__visual">
                        <figure className="sticky-steps__frame">
                          <div className="sticky-steps__frame-inner">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              className="sticky-steps__cover-image"
                              sizes="(min-width: 992px) 34vw, 92vw"
                            />
                          </div>
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
