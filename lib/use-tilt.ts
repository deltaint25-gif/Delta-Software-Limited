"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { createSpringLoop } from "@/lib/motion-spring";

/**
 * Subtle pointer-driven 3D tilt for premium cards (portfolio, showreel).
 * Returns a ref to attach to the card element. No-ops under
 * prefers-reduced-motion or on touch devices (no pointermove to react to).
 * Caller should NOT combine this with a CSS hover transform (e.g.
 * hover:-translate-y-1) on the same element — this sets the element's
 * inline transform directly, so a stylesheet :hover rule for the same
 * property would just get overridden.
 */
export function useTilt<T extends HTMLElement>(maxDegrees = 5) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const spring = createSpringLoop(
      (v) => {
        el.style.transform = `perspective(800px) rotateX(${v.rotX}deg) rotateY(${v.rotY}deg) scale(${v.scale}) translateY(${v.lift}px)`;
      },
      { rotX: 0, rotY: 0, scale: 1, lift: 0 },
      0.14
    );

    function handleMove(event: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      spring.setTargets({
        rotX: relY * -maxDegrees * 2,
        rotY: relX * maxDegrees * 2,
        scale: 1.015,
        lift: -4,
      });
    }

    function handleLeave() {
      spring.setTargets({ rotX: 0, rotY: 0, scale: 1, lift: 0 });
    }

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      spring.stop();
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      el.style.transform = "";
    };
  }, [reducedMotion, maxDegrees]);

  return ref;
}
