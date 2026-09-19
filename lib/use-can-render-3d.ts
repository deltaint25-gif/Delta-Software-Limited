"use client";

import { useEffect, useState } from "react";

/**
 * Minimum device profile for mounting the WebGL hero.
 *
 * three.js is a 672KB chunk (167KB over the wire) whose evaluation, geometry
 * extrusion, environment pre-render and particle sampling all land on the main
 * thread. On a mid-range phone that measured as ~9.9s of total blocking time —
 * the page is effectively frozen while a decorative element boots. No amount of
 * code splitting fixes that, because the cost is execution, not download: the
 * only real fix is not running it on hardware that can't absorb it.
 */
const MIN_VIEWPORT_PX = 1024;
const MIN_CORES = 4;
const MIN_MEMORY_GB = 4;

interface CapabilityNavigator extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

/**
 * Whether this device should get the WebGL hero rather than the static mark.
 *
 * Always starts false so the server render and the first client paint agree
 * (the checks below read browser-only APIs, so deciding during render would
 * hydrate-mismatch). When the device does qualify, the scene is still deferred
 * to idle so it never competes with hydration or the largest contentful paint.
 */
export function useCanRender3D(): boolean {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < MIN_VIEWPORT_PX) return;

    const nav = navigator as CapabilityNavigator;
    if ((nav.hardwareConcurrency ?? 0) < MIN_CORES) return;
    // deviceMemory is Chromium-only; absent means "unknown", not "low".
    if (nav.deviceMemory !== undefined && nav.deviceMemory < MIN_MEMORY_GB) return;
    if (nav.connection?.saveData) return;
    if (nav.connection?.effectiveType && /(^|-)[23]g$/.test(nav.connection.effectiveType)) return;

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const start = () => setCanRender(true);

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutId = setTimeout(start, 1200);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return canRender;
}
