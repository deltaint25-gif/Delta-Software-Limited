"use client";

import type { CSSProperties } from "react";
import HeroCyclingLine from "./HeroCyclingLine";
import { useTilt } from "@/lib/use-tilt";

interface HeadlineLineData {
  text: string;
  /** Renders this line in the brand-accent red instead of dark slate. */
  accent?: boolean;
}

const HEADLINE_LINES: HeadlineLineData[] = [
  { text: "We Engineer" },
  { text: "What's Next.", accent: true },
];

/** Splits a line into word groups (kept nowrap so lines break only between
 * words) of individually-masked characters, for a per-character stagger
 * reveal rather than a whole-line slide. Word gaps come from the flex
 * `gap`, not a text-node space — a literal space char here gets collapsed
 * to zero width by the headline's negative tracking (tracking-tighter),
 * which silently glued adjacent words together. */
function HeadlineLine({ text, accent, startIndex }: HeadlineLineData & { startIndex: number }) {
  const words = text.split(" ");
  // Running index across the whole headline drives the CSS stagger via
  // --char-i, so the reveal needs no JS to sequence it.
  let charIndex = startIndex;
  return (
    <span
      className={`hero-line flex flex-wrap items-baseline justify-center gap-x-[0.25em] xl:justify-start ${accent ? "text-accent-red" : "text-slate-900"}`}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((char, ci) => (
            <span key={ci} className="hero-char inline-block overflow-hidden">
              <span
                className="hero-char-inner inline-block"
                style={{ "--char-i": charIndex++ } as CSSProperties}
              >
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/**
 * Badge + heading + cycling subheading — the part of the hero copy that
 * sits ABOVE the 3D visual row (see Hero.tsx). Split out of what used to
 * be one HeroContent component so the 3D object can occupy its own row in
 * between this and HeroContentBottom, in normal document order, without
 * duplicating the (WebGL-heavy) 3D component itself.
 */
export default function HeroContentTop() {
  // Badge gets its own pointer-driven 3D tilt (see use-tilt.ts).
  const badgeTilt = useTilt<HTMLDivElement>(4);

  return (
    <div
      className="relative flex flex-col items-center text-center xl:items-start xl:text-left"
    >
      <div
        ref={badgeTilt}
        className="hero-badge hero-fade mx-auto mb-[clamp(0.5rem,2.5vh,1rem)] inline-flex max-w-full items-center gap-2 rounded-pill border border-slate-200 bg-white px-4 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_-16px_rgba(15,23,42,0.18)] sm:mb-[clamp(0.75rem,3vh,1.5rem)] xl:mx-0 xl:mb-[clamp(0.375rem,1.8vh,1.5rem)]"
      >
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-red" aria-hidden="true" />
        <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.15em] text-slate-700">
          Delta Software Limited
        </span>
      </div>

      <h1 className="text-display relative font-black tracking-tighter">
        {HEADLINE_LINES.map((line, index) => (
          <HeadlineLine
            key={line.text}
            text={line.text}
            accent={line.accent}
            startIndex={HEADLINE_LINES.slice(0, index).reduce((n, l) => n + l.text.replace(/ /g, "").length, 0)}
          />
        ))}
      </h1>

      <div className="hero-rise mt-[clamp(0.375rem,1.6vh,0.75rem)] w-full [--rise-delay:200ms] sm:mt-[clamp(0.5rem,2vh,1rem)] xl:mt-[clamp(0.25rem,1.2vh,1rem)]">
        <HeroCyclingLine />
      </div>
    </div>
  );
}
