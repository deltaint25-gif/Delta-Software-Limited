"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Animates a numeric prefix (e.g. "40%", "27%") counting up from 0 once
 * `inView` becomes true, preserving whatever non-numeric suffix follows
 * the number. Under reduced-motion, or before inView, just returns the
 * final value.
 */
export function useCountUp(target: string, inView: boolean, duration = 1200): string {
  const reducedMotion = usePrefersReducedMotion();
  const match = target.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numericTarget = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (numericTarget === null || reducedMotion || !inView || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(numericTarget! * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numericTarget, duration, reducedMotion]);

  if (numericTarget === null) return target;
  if (reducedMotion) return target;
  if (!inView) return `0${suffix}`;
  return `${value}${suffix}`;
}
