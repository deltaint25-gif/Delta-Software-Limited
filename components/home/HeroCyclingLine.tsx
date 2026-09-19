"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const PHRASES = ["Digital Products.", "Intelligent Systems.", "Scalable Technology.", "Real-World Impact."];
const CYCLE_MS = 2600;

/**
 * Cycles through a short list of positioning phrases with a vertical
 * slide/mask transition (not a typing effect) — one phrase visible at a
 * time inside a fixed-height, overflow-hidden window. Freezes on the first
 * phrase under prefers-reduced-motion instead of cycling.
 */
export default function HeroCyclingLine() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="hero-cycle relative h-7 w-full overflow-hidden sm:h-8">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={reducedMotion ? "static" : index}
          initial={reducedMotion ? false : { y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reducedMotion ? undefined : { y: -22, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center text-base font-semibold uppercase tracking-[0.08em] text-accent-red sm:text-lg lg:justify-start"
        >
          {PHRASES[reducedMotion ? 0 : index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
