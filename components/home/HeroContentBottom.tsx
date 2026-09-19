"use client";

import { useRef, type MutableRefObject } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { useTilt } from "@/lib/use-tilt";

/**
 * Paragraph + CTA — the part of the hero copy that sits BELOW the 3D
 * visual row (see Hero.tsx). Split out of what used to be one HeroContent
 * component so the 3D object can occupy its own row in between
 * HeroContentTop and this, in normal document order, without duplicating
 * the (WebGL-heavy) 3D component itself.
 */
export default function HeroContentBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  // CTA gets its own pointer-driven 3D tilt (see use-tilt.ts) — it sets its
  // own inline transform, so it can't share an element with a CSS hover
  // transform, but composes fine with MagneticButton's translate (that's on
  // the wrapper div, tilt is on the inner anchor).
  const primaryTilt = useTilt<HTMLAnchorElement>(3);
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();

  function setPrimaryRefs(node: HTMLAnchorElement | null) {
    (primaryTilt as MutableRefObject<HTMLAnchorElement | null>).current = node;
    (glowRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center text-center xl:items-start xl:text-left"
    >
      {/*
        `text-base` until 360px: at 320 the 18px size ran this paragraph to
        seven lines over a 252px measure — 196px of copy that pushed the CTA
        41px below the fold, and a measure that narrow reads badly at 18px
        anyway. Every width from 360 up keeps the original size.
      */}
      <p className="hero-sub hero-slide mx-auto max-w-[90%] text-base text-slate-600 min-[360px]:text-lg md:max-w-[640px] xl:mx-0 xl:max-w-md">
        We transform ambitious ideas into high-performance digital products, intelligent
        systems, and scalable technology &mdash; combining strategy, design, and engineering
        from first concept to production.
      </p>

      <div className="hero-cta mt-[clamp(0.75rem,3.5vh,1.5rem)] flex flex-wrap items-center justify-center gap-4 sm:mt-[clamp(1rem,4vh,2rem)] xl:mt-[clamp(0.75rem,3vh,2rem)] xl:justify-start">
        <MagneticButton className="hero-cta-item hero-fade [--rise-delay:260ms]">
          <Link
            ref={setPrimaryRefs}
            href="/contact"
            onPointerMove={handlePointerMove}
            className="liquid-glow-light group relative overflow-hidden btn-pill-primary gap-2 focus-visible:ring-offset-white"
            data-cursor-hover
          >
            Start a Project
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}
