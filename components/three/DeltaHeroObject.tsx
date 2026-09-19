"use client";

import dynamic from "next/dynamic";
import { LogoMark } from "@/components/Logo";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useCanRender3D } from "@/lib/use-can-render-3d";
import WebGLErrorBoundary from "./WebGLErrorBoundary";

const DeltaScene = dynamic(() => import("./DeltaScene"), { ssr: false });

interface DeltaHeroObjectProps {
  className?: string;
  /** Extra px offset applied as a smoothed translate, e.g. for mouse parallax. */
  parallaxX?: number;
  parallaxY?: number;
  /**
   * Compose the parallax translate with a -50% Y offset, for callers that
   * position this with `top-1/2` — the inline transform below would
   * otherwise silently clobber a `-translate-y-1/2` utility class, since
   * inline styles always win over stylesheet classes for the same property.
   */
  centerY?: boolean;
}

const DEFAULT_CLASSNAME =
  "pointer-events-none absolute -right-8 top-16 h-[26rem] w-[26rem] opacity-90 xl:-right-4";

/**
 * Static stand-in for the WebGL hero: the same brand mark, drawn as one inline
 * SVG path with a CSS bloom behind it. Zero scripting cost, so it is what
 * phones, low-core machines, save-data users and reduced-motion users get.
 */
function StaticHeroMark() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-[78%] max-w-[26rem]">
        <div
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(239,65,54,0.22),transparent_65%)] blur-2xl"
          aria-hidden="true"
        />
        <LogoMark className="relative h-full w-full text-accent-red drop-shadow-[0_24px_48px_rgba(239,65,54,0.3)]" />
      </div>
    </div>
  );
}

/**
 * Signature 3D brand object for the hero. Mounted only where the device can
 * absorb it (see useCanRender3D) — everywhere else the static mark above keeps
 * the composition intact at no scripting cost. `prefers-reduced-motion` still
 * gates the idle/parallax animation via the `reducedMotion` prop.
 */
export default function DeltaHeroObject({
  className = DEFAULT_CLASSNAME,
  parallaxX = 0,
  parallaxY = 0,
  centerY = false,
}: DeltaHeroObjectProps) {
  const reducedMotion = usePrefersReducedMotion();
  const canRender3D = useCanRender3D();

  const translateY = centerY ? `calc(-50% + ${parallaxY}px)` : `${parallaxY}px`;

  return (
    <div
      className={`hero-fade [--rise-delay:420ms] ${className}`}
      style={{
        transform: `translate3d(${parallaxX}px, ${translateY}, 0)`,
        transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
      aria-hidden="true"
    >
      {canRender3D ? (
        <WebGLErrorBoundary fallback={<StaticHeroMark />}>
          <DeltaScene reducedMotion={reducedMotion} />
        </WebGLErrorBoundary>
      ) : (
        <StaticHeroMark />
      )}
    </div>
  );
}
