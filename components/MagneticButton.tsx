"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { createSpringLoop } from "@/lib/motion-spring";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Wraps a CTA so it subtly follows the pointer within its own bounds and
 * springs back to rest on leave. Restrained by design — this is not a
 * drag-the-button-across-the-screen effect, just a few pixels of pull.
 * No-ops under prefers-reduced-motion or on touch (no pointermove to react to).
 */
export default function MagneticButton({ children, className, strength = 14 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const spring = createSpringLoop(
      (v) => {
        el.style.transform = `translate(${v.x}px, ${v.y}px)`;
      },
      { x: 0, y: 0 },
      0.18
    );

    function handleMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      spring.setTargets({ x: (relX / rect.width) * strength, y: (relY / rect.height) * strength });
    }

    function handleLeave() {
      spring.setTargets({ x: 0, y: 0 });
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      spring.stop();
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      el.style.transform = "";
    };
  }, [reducedMotion, strength]);

  return (
    <div ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </div>
  );
}
