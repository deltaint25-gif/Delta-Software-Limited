"use client";

import { useRef, useState, type PointerEvent } from "react";
import DeltaHeroObject from "@/components/three/DeltaHeroObject";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const PARALLAX_RANGE = 22;

// Below `lg` the object is a normal, fully-visible block filling its own
// fixed-size grid cell (see Hero.tsx) — matching the reference mockup's
// mobile/tablet composition. At `lg`+ it switches to the desktop-only
// layout: right-aligned, overlapping into the text column, centered
// vertically via `centerY` (not a translateY class — DeltaHeroObject
// already sets its own inline `transform` for parallax/centerY, which
// would silently clobber a competing CSS-class transform on the same
// element).
// `top-1/2` + `centerY`'s -50% transform is the standard vertical-centering
// trick, which stays correct even when the object is `h-full` of an
// already-exact-height parent (mobile) — it's mathematically equivalent to
// `inset-0` there, so the same className works for both cases below.
// Desktop canvas sizes are ~13% larger than they used to be: DeltaScene now
// frames the mark's full bounding sphere (so it can't clip mid-spin), which
// renders it smaller inside the same box — the slightly roomier canvas keeps
// its on-screen presence close to what it was, now complete rather than
// cropped at the edges.
// Fills whatever box Hero.tsx gives it, at every size. It used to pin itself
// to `right: -2rem` at a fixed rem width sized for the old 1600px container;
// against the narrower 1200px grid that pushed the mark 67px left of its own
// column and straight over the paragraph.
const LOGO_CLASSNAME =
  "pointer-events-none absolute inset-x-0 top-1/2 h-full w-full opacity-100";

/**
 * Positions the signature 3D delta object in the hero's visual column and
 * adds a subtle cursor-parallax drift on top of the object's own internal
 * pointer-tilt, so the mark reads as sitting at a different depth than the
 * rest of the layout. No-ops under prefers-reduced-motion.
 */
export default function Hero3DLogo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: relX * PARALLAX_RANGE, y: relY * PARALLAX_RANGE });
  }

  function handlePointerLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="absolute inset-0"
      aria-hidden="true"
    >
      {/* Ambient red spotlight behind the mark — a scaled-down version shows
          at every size now that the object itself is a full-visibility
          focal element below `lg` too, not just a dimmed background. */}
      <div
        className="absolute right-1/2 top-1/2 h-[16rem] w-[16rem] -translate-y-1/2 translate-x-1/2 rounded-full opacity-70 blur-[70px] lg:right-[8%] lg:h-[26rem] lg:w-[26rem] lg:translate-x-0 lg:blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(239,65,54,0.22) 0%, rgba(239,65,54,0.08) 45%, transparent 75%)",
        }}
      />
      <DeltaHeroObject
        className={LOGO_CLASSNAME}
        parallaxX={reducedMotion ? 0 : offset.x}
        parallaxY={reducedMotion ? 0 : offset.y}
        centerY
      />
      {/* Soft contact shadow projected beneath the object for depth — desktop only, same reasoning as the spotlight above */}
      <div
        className="absolute right-[14%] top-[68%] hidden h-10 w-64 rounded-full bg-black/20 blur-2xl lg:block xl:right-[10%]"
        style={{ transform: `translate(${reducedMotion ? 0 : offset.x * 0.4}px, 0)` }}
      />
    </div>
  );
}
