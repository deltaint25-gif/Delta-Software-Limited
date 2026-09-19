"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Route-level transition. Keyed by pathname so App Router swaps trigger
 * an exit/enter crossfade instead of a hard cut. Scroll restoration stays
 * native (no manual scrollTo) — Next.js already resets scroll on
 * navigation before this mounts the new page.
 *
 * Deliberately opacity-only, no transform/filter: either one on this
 * wrapper would make it a new containing block for every `position:
 * fixed` descendant on every page (GSAP ScrollTrigger pins, the reading
 * progress bar, etc.) per the CSS spec, silently detaching them from the
 * real viewport. A plain fade avoids that whole class of bug sitewide.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
