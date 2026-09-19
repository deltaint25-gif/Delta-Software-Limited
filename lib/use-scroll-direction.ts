import { useEffect, useRef, useState } from "react";

/**
 * "up" | "down" scroll direction, with a small distance threshold so it
 * doesn't flip on sub-pixel/momentum jitter, and pinned to "up" near the
 * very top so the navbar never shrinks before the page has actually
 * scrolled anywhere.
 */
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;
      if (y < 80) {
        setDirection("up");
        lastY.current = y;
        return;
      }
      const delta = y - lastY.current;
      if (Math.abs(delta) < threshold) return;
      setDirection(delta > 0 ? "down" : "up");
      lastY.current = y;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return direction;
}
