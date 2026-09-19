/**
 * Shared timing for the hero mark's intro sequence, in seconds from mount.
 *
 * The intro plays once; everything after SETTLE_END is a continuous idle that
 * starts from exactly the pose the intro ends on, so the transition into the
 * loop is seamless rather than a cut. Each phase is expressed as a window so
 * the scene components can read the same clock independently instead of
 * threading state between them.
 */
export const TIMELINE = {
  /** Particles drift in from the surrounding space. */
  particlesIn: [0.15, 1.0],
  /** They converge onto the mark's surface. */
  assemble: [0.45, 2.9],
  /** Solid geometry resolves out of the particle cloud. */
  solidify: [1.7, 3.1],
  /** Particle cloud dissolves once the solid has taken over. */
  particlesOut: [2.3, 3.3],
  /** Slow orbit out and back. */
  orbit: [3.0, 9.0],
  /** Rings and accents fade up. */
  rings: [5.0, 7.0],
  /** Camera eases closer, then relaxes into its resting distance. */
  pushIn: [6.8, 8.6],
  pushOut: [8.6, 10.0],
} as const;

export const SETTLE_END = 10;

/** How much closer than the fitted distance the push-in goes, at its peak. */
export const PUSH_DEPTH = 0.08;
/** Resting distance after the intro, as a fraction of the fitted distance. */
export const REST_FACTOR = 0.97;
/** Peak azimuth / elevation of the cinematic orbit, in radians. */
export const ORBIT_AZIMUTH = 0.34;
export const ORBIT_ELEVATION = 0.1;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const progress = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Camera framing at time `t`, as an offset from the fitted distance.
 *
 * The orbit is an out-and-back arc (a half sine over the window) rather than a
 * continuous revolution, so it returns to dead centre on its own — that's what
 * lets the idle pick up from zero without a jump. Distance only ever *shrinks*
 * from the fitted value, never grows, and the shrink is bounded by PUSH_DEPTH,
 * which is what keeps the mark inside the frame through the whole move.
 */
export function cameraPose(t: number) {
  const arc = Math.sin(easeInOutCubic(progress(t, TIMELINE.orbit)) * Math.PI);
  const idle = Math.max(0, t - SETTLE_END);

  const azimuth = arc * ORBIT_AZIMUTH + Math.sin(idle * 0.12) * 0.05;
  const elevation = arc * ORBIT_ELEVATION + Math.sin(idle * 0.09) * 0.03;

  // Dips to (1 - PUSH_DEPTH) at the peak of the push, then relaxes back up to
  // REST_FACTOR and stays there for the idle.
  const pushed = smoothstep(progress(t, TIMELINE.pushIn));
  const relaxed = smoothstep(progress(t, TIMELINE.pushOut));
  const distanceFactor = 1 - PUSH_DEPTH * pushed + (PUSH_DEPTH - (1 - REST_FACTOR)) * relaxed;

  return { azimuth, elevation, distanceFactor };
}
