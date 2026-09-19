"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Adds a subtle blur-to-sharp focus pull alongside the fade/slide. */
  blur?: boolean;
}

export default function Reveal({ children, delay = 0, className, blur = false }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: blur ? 0.7 : 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
