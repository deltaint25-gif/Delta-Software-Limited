"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "button" | "link" | "image" | "video" | "project" | "service" | "drag";

const STATE_LABEL: Partial<Record<CursorState, string>> = {
  video: "Play",
  project: "View",
  service: "Explore",
  drag: "Drag",
};

const STATE_SIZE: Record<CursorState, number> = {
  default: 32,
  button: 56,
  link: 44,
  image: 64,
  video: 76,
  project: 88,
  service: 88,
  drag: 76,
};

function resolveCursorState(target: EventTarget | null): CursorState {
  const el = target instanceof HTMLElement ? target : null;
  if (!el) return "default";

  const explicit = el.closest<HTMLElement>("[data-cursor]");
  const value = explicit?.dataset.cursor as CursorState | undefined;
  if (value && value in STATE_SIZE) return value;

  if (el.closest("[data-cursor-hover]")) return "button";
  if (el.closest("a")) return "link";
  if (el.closest("button")) return "button";
  return "default";
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState<CursorState>("default");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const quickX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const quickY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    function handleMove(event: MouseEvent) {
      gsap.set(dot, { x: event.clientX, y: event.clientY });
      quickX(event.clientX);
      quickY(event.clientY);
    }

    function handleOver(event: MouseEvent) {
      setCursorState(resolveCursorState(event.target));
    }

    function handleOut(event: MouseEvent) {
      setCursorState(resolveCursorState(event.relatedTarget));
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = STATE_SIZE[cursorState];
  const label = STATE_LABEL[cursorState];
  const isDefault = cursorState === "default";
  const isLink = cursorState === "link";

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-red transition-opacity duration-200 ${
          isDefault ? "h-1.5 w-1.5 opacity-100" : "h-1 w-1 opacity-0"
        }`}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ width: size, height: size }}
        className={`pointer-events-none fixed left-0 top-0 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-300 ease-out ${
          label
            ? "border-transparent bg-accent-red-deep opacity-100"
            : isLink
            ? "border-white/70 bg-transparent opacity-100"
            : cursorState === "button"
            ? "border-transparent bg-accent-red/20 opacity-100"
            : "border-accent-red/60 bg-transparent opacity-60"
        }`}
      >
        {label && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white">{label}</span>
        )}
      </div>
    </>
  );
}
