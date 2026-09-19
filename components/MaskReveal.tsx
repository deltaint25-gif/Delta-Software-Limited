"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Whether the (unclipped) container this sits in has scrolled into
   * view. Deliberately a controlled prop rather than this component
   * doing its own viewport detection: an element whose own clip-path
   * starts fully closed can end up with a permanently zero
   * IntersectionObserver ratio in Chromium, since the clipped area is
   * what gets measured — a deadlock where it must be visible to be
   * detected, and must be detected to become visible. The caller
   * should observe an unclipped ancestor instead.
   */
  inView: boolean;
}

/**
 * Vertical clip-path wipe, like a curtain lifting — used for the
 * portfolio/case-study visuals where a plain fade would undersell the
 * moment. Kept to a handful of call sites per the brief: only where it
 * improves storytelling, not a sitewide default.
 */
export default function MaskReveal({ children, className, delay = 0, inView }: MaskRevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
      transition={{ duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
