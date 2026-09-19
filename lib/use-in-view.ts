"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Native IntersectionObserver-based "has this element scrolled into
 * view yet" check, watching an externally-supplied ref rather than
 * creating its own — so it can share a DOM node with another hook
 * (e.g. useTilt) that already holds a ref to it.
 *
 * Framer Motion's whileInView does the same job, but don't point it (or
 * this) at an element whose own clip-path starts fully closed: Chromium
 * appears to compute that element's intersection ratio against its own
 * clipped (zero-area) bounds, which can never resolve to intersecting —
 * a deadlock where it must become visible to be detected, and must be
 * detected to become visible. Point this at an unclipped ancestor instead.
 */
export function useInView(ref: RefObject<HTMLElement>, amount = 0.2) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount, inView]);

  return inView;
}
