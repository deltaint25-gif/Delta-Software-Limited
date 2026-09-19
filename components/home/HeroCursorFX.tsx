"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";

const MAX_BUBBLES = 20;
const SPAWN_INTERVAL_MS = 90;
const MIN_MOVE_PX = 6;

interface HeroCursorFXProps {
  containerRef: RefObject<HTMLElement>;
}

/**
 * Hero-scoped signature detail, layered on top of the sitewide CustomCursor
 * ring rather than replacing it: a soft red glow that trails the pointer
 * with a slight lag, plus small red "liquid" bubbles that pop outward as it
 * moves. Mouse-only — gated the same way as CustomCursor, on
 * `(hover: hover) and (pointer: fine)` plus `prefers-reduced-motion` — and
 * fully imperative (direct DOM + gsap, no React state per pointer move) so
 * it never triggers a re-render on mousemove.
 */
export default function HeroCursorFX({ containerRef }: HeroCursorFXProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const layer = layerRef.current;
    const glow = glowRef.current;
    if (!container || !layer || !glow) return;

    const quickX = gsap.quickTo(glow, "x", { duration: 0.2, ease: "power3.out" });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.2, ease: "power3.out" });

    let activeBubbles = 0;
    let lastSpawn = 0;
    let lastX = 0;
    let lastY = 0;
    let hovering = false;

    function spawnBubble(x: number, y: number, boosted: boolean) {
      if (activeBubbles >= MAX_BUBBLES) return;
      const roll = Math.random();
      const size = roll > 0.94 ? 10 + Math.random() * 6 : roll > 0.7 ? 6 + Math.random() * 4 : 3 + Math.random() * 2;
      const angle = Math.random() * Math.PI * 2;
      const distance = 16 + Math.random() * (boosted ? 30 : 20);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 10;
      const duration = 520 + Math.random() * 640;
      const jitterX = (Math.random() - 0.5) * 12;
      const jitterY = (Math.random() - 0.5) * 12;

      const bubble = document.createElement("span");
      bubble.style.position = "absolute";
      bubble.style.left = `${x + jitterX}px`;
      bubble.style.top = `${y + jitterY}px`;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.marginLeft = `${-size / 2}px`;
      bubble.style.marginTop = `${-size / 2}px`;
      bubble.style.borderRadius = "9999px";
      bubble.style.background =
        size > 9
          ? "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85), rgba(239,65,54,0.9) 45%, rgba(185,28,28,0.85) 100%)"
          : "rgba(239,65,54,0.85)";
      if (size > 7) bubble.style.boxShadow = "0 0 10px 1px rgba(239,65,54,0.4)";
      bubble.style.setProperty("--bx", `${dx}px`);
      bubble.style.setProperty("--by", `${dy}px`);
      bubble.style.setProperty("--bx-end", `${dx * 1.6}px`);
      bubble.style.setProperty("--by-end", `${dy * 1.6 - 12}px`);
      bubble.style.animation = `hero-bubble-pop ${duration}ms cubic-bezier(0.16,1,0.3,1) forwards`;

      function cleanup() {
        bubble.remove();
        activeBubbles -= 1;
      }
      bubble.addEventListener("animationend", cleanup);
      // Fallback in case animationend never fires (e.g. tab backgrounded).
      window.setTimeout(cleanup, duration + 400);

      layer!.appendChild(bubble);
      activeBubbles += 1;
    }

    function handleMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const rect = container!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      quickX(x);
      quickY(y);

      const now = performance.now();
      const moved = Math.hypot(x - lastX, y - lastY);
      if (now - lastSpawn > SPAWN_INTERVAL_MS && moved > MIN_MOVE_PX) {
        const count = hovering ? (Math.random() > 0.5 ? 3 : 2) : Math.random() > 0.5 ? 1 : 2;
        for (let i = 0; i < count; i += 1) spawnBubble(x, y, hovering);
        lastSpawn = now;
        lastX = x;
        lastY = y;
      }
    }

    function handleEnter(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }

    function handleLeave() {
      gsap.to(glow, { opacity: 0, scale: 1, duration: 0.4, ease: "power2.out" });
      hovering = false;
    }

    function handleOver(event: PointerEvent) {
      if (event.target instanceof HTMLElement && event.target.closest("[data-cursor-hover]")) {
        hovering = true;
        gsap.to(glow, { scale: 1.7, duration: 0.3, ease: "power2.out" });
      }
    }

    function handleOut(event: PointerEvent) {
      const related = event.relatedTarget;
      const stillHovering = related instanceof HTMLElement && related.closest("[data-cursor-hover]");
      if (!stillHovering) {
        hovering = false;
        gsap.to(glow, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    }

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerenter", handleEnter);
    container.addEventListener("pointerleave", handleLeave);
    container.addEventListener("pointerover", handleOver);
    container.addEventListener("pointerout", handleOut);

    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerenter", handleEnter);
      container.removeEventListener("pointerleave", handleLeave);
      container.removeEventListener("pointerover", handleOver);
      container.removeEventListener("pointerout", handleOut);
      layer.replaceChildren();
    };
  }, [containerRef, enabled]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-[20] overflow-hidden" aria-hidden="true">
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-md"
        style={{
          background: "radial-gradient(circle, rgba(239,65,54,0.5) 0%, rgba(239,65,54,0.15) 55%, transparent 75%)",
        }}
      />
    </div>
  );
}
