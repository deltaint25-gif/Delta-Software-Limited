"use client";

import { useMemo } from "react";
import styles from "./HeroBackground.module.css";

const PARTICLE_COUNT = 10;

function useParticles() {
  return useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        size: 2 + (i % 3),
        duration: 10 + (i % 5) * 2.4,
        delay: -(i * 1.3),
      })),
    []
  );
}

/**
 * Purely decorative, layered backdrop for the light-theme hero: an office
 * photograph with a responsive white wash, a faint grid, a red ambient bloom
 * behind the headline, drifting blur orbs, floating particles, and a grain
 * overlay for a non-flat surface. Everything here is aria-hidden and
 * pointer-events-none; particle drift and the ray sweep are switched off
 * under prefers-reduced-motion via CSS. The bottom edge stays light to
 * preserve footer readability in the permanently white hero.
 */
export default function HeroBackground() {
  const particles = useParticles();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Photo and white wash stay below all existing content and effects. */}
      <div className={`${styles.photo} absolute inset-0`} />
      <div className={`${styles.wash} absolute inset-0`} />

      {/* Faint diagonal grid for a technical, blueprint-like texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.4]" aria-hidden="true">
        <defs>
          <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(15,23,42,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Red ambient bloom behind the headline — the accent line's "glow"
          lives here as a background layer rather than a per-glyph
          text-shadow, so it reads as ambient light in the composition. */}
      <div
        className="hero-bg-glow absolute left-[8%] top-[38%] h-[26rem] w-[26rem] -translate-y-1/2 rounded-full blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(239,65,54,0.16) 0%, rgba(239,65,54,0.05) 45%, transparent 75%)",
        }}
      />

      {/* Drifting blur orbs for depth */}
      <div className="blob -right-20 top-0 h-96 w-96 bg-accent-red/[0.05]" />
      <div className="blob left-1/3 bottom-0 h-72 w-72 bg-slate-900/[0.03]" style={{ animationDelay: "-9s" }} />

      {/* Soft diagonal light sweep */}
      <div
        className="hero-bg-ray absolute -left-1/4 top-0 h-full w-1/2 -rotate-12"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 45%, transparent 100%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="hero-bg-particle absolute rounded-full bg-slate-900/20"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Grain texture for a filmic, non-flat surface */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.02] mix-blend-multiply">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* Light footer wash remains consistent with the white hero. */}
      <div className={`${styles.bottomFade} absolute inset-x-0 bottom-0 h-56`} />
    </div>
  );
}
