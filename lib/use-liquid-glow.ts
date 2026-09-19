import { useRef, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Cursor-follow glow position for the `.liquid-glow` CSS utility — sets
 * --glow-x/--glow-y directly on the element via a ref so the radial
 * highlight tracks the pointer without triggering a React re-render per
 * pointer move. Pair with the `liquid-glow` class from globals.css.
 */
export function useLiquidGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  function handlePointerMove(event: ReactPointerEvent<T>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  }

  return { ref, handlePointerMove };
}
