"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Stand-ins, not clients. These are typeset placeholders so the strip has
// real dimensions to lay out against — swap them for actual client marks
// (or drop the section) before this claim goes in front of anyone.
const PLACEHOLDER_BRANDS = [
  "Nova Labs",
  "Brightpath",
  "Aurex",
  "Fieldstone",
  "Verdant",
  "Northline",
  "Kestrel Co.",
  "Milestone",
];

/** "Nova Labs" -> "NL", "Aurex" -> "AU" — a monogram to anchor the wordmark. */
function monogram(brand: string) {
  const words = brand.replace(/[^A-Za-z ]/g, "").split(" ").filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return brand.slice(0, 2).toUpperCase();
}

function BrandCard({ brand }: { brand: string }) {
  return (
    <div className="group flex h-[4.5rem] w-52 flex-shrink-0 items-center gap-3.5 rounded-md border border-line bg-surface px-5 shadow-elevation-1 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-elevation-2 dark:shadow-elevation-1-dark dark:hover:shadow-elevation-2-dark">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-fill-soft font-display text-[0.7rem] font-bold tracking-tight text-fg-dim transition-colors duration-300 group-hover:bg-accent-red/10 group-hover:text-accent-red"
      >
        {monogram(brand)}
      </span>
      <span className="truncate font-display text-[0.95rem] font-semibold leading-tight tracking-tight text-fg-dim transition-colors duration-300 group-hover:text-fg">
        {brand}
      </span>
    </div>
  );
}

export default function LogoStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track, {
          xPercent: -50,
          duration: 34,
          ease: "none",
          repeat: -1,
        });

        const pause = () => tween.pause();
        const resume = () => tween.play();
        track.addEventListener("mouseenter", pause);
        track.addEventListener("mouseleave", resume);
        track.addEventListener("focusin", pause);
        track.addEventListener("focusout", resume);

        return () => {
          track.removeEventListener("mouseenter", pause);
          track.removeEventListener("mouseleave", resume);
          track.removeEventListener("focusin", pause);
          track.removeEventListener("focusout", resume);
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: trackRef }
  );

  return (
    <section className="border-t border-line bg-bg-alt/40">
      <div className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8">
          <p className="eyebrow">Trusted by growing businesses</p>
          <span className="mt-4 h-px w-12 bg-line" aria-hidden="true" />
        </div>
        <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:mt-12">
          {/* Two identical groups, each carrying its own trailing gutter, so
              one group is exactly half the track and xPercent:-50 loops with
              no seam. A single flat list with `gap` leaves half a gap
              unaccounted for and visibly jumps every cycle. The duplicate is
              hidden from assistive tech so the names aren't announced twice. */}
          <div ref={trackRef} className="flex w-max">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 || undefined}
                className="flex flex-shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6"
              >
                {PLACEHOLDER_BRANDS.map((brand) => (
                  <BrandCard key={brand} brand={brand} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
