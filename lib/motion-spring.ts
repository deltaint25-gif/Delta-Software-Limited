"use client";

/**
 * Minimal dependency-free spring/lerp loop for pointer-driven micro
 * interactions (tilt, magnetic buttons). Deliberately not GSAP: those
 * effects are only used from a handful of components, and pulling GSAP's
 * transform-plugin code into their bundle for that alone was adding a
 * separate ~8KB-gzipped chunk to pages that don't otherwise need it.
 * requestAnimationFrame stops itself once the values settle, so idle
 * cards cost nothing.
 */
export function createSpringLoop<T extends Record<string, number>>(
  apply: (values: T) => void,
  initial: T,
  stiffness = 0.15,
  precision = 0.01
) {
  const current = { ...initial };
  const targets = { ...initial };
  let raf: number | null = null;

  function tick() {
    let settled = true;
    (Object.keys(targets) as (keyof T)[]).forEach((key) => {
      const diff = targets[key] - current[key];
      if (Math.abs(diff) > precision) {
        current[key] = (current[key] + diff * stiffness) as T[keyof T];
        settled = false;
      } else {
        current[key] = targets[key];
      }
    });
    apply(current);
    raf = settled ? null : requestAnimationFrame(tick);
  }

  function setTargets(next: Partial<T>) {
    Object.assign(targets, next);
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
  }

  return { setTargets, stop };
}
