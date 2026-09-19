"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import MockupFrame from "@/components/MockupFrame";
import { useTilt } from "@/lib/use-tilt";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { PROJECTS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

/**
 * Panel width and the track's leading/trailing gutter are derived from the
 * same 1088px figure the section heading occupies (max-w-6xl minus its
 * px-8), so the first card lines up exactly under "Case studies" and the
 * last one stops at the matching right-hand margin. Cards are separated by
 * a normal gutter rather than a viewport-wide void — the old panels were
 * `w-screen`, which left ~770px of empty space between neighbours at 1920.
 */
const CARD_W = "lg:w-[min(1088px,calc(100vw-4rem))]";
const TRACK_GUTTER = "lg:pl-[max(2rem,calc((100vw-1088px)/2))] lg:pr-[max(2rem,calc((100vw-1088px)/2))]";

function ShowcasePanel({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const tiltRef = useTilt<HTMLAnchorElement>(4);
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();

  function setRefs(node: HTMLAnchorElement | null) {
    (tiltRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
    (glowRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
  }

  return (
    <div className={`showcase-panel flex w-[86vw] flex-shrink-0 snap-center sm:w-[68vw] lg:snap-none ${CARD_W}`}>
      <Link
        ref={setRefs}
        href={`/portfolio/${project.slug}`}
        data-cursor="project"
        onPointerMove={handlePointerMove}
        className="liquid-glow liquid-card group relative grid w-full overflow-hidden rounded-feature border border-line bg-surface lg:min-h-[clamp(360px,44vh,480px)] lg:grid-cols-[1.25fr_1fr]"
      >
        <MockupFrame
          variant={project.variant}
          tone="surface"
          className="aspect-[25/14] border-b border-line lg:aspect-auto lg:h-full lg:border-b-0 lg:border-r"
          deviceClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        <div className="flex flex-col p-7 sm:p-10 lg:justify-center lg:p-10 xl:p-12">
          <div className="flex items-center gap-4">
            <span className="font-display text-[2.5rem] font-bold leading-none tabular-nums text-fg-ghost">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-10 flex-shrink-0 bg-line" aria-hidden="true" />
            <span className="text-caption">{project.tags[0]}</span>
          </div>
          <h3 className="mt-6 text-h2 text-fg transition-transform duration-300 ease-out group-hover:translate-x-1">
            {project.name}
          </h3>
          <p className="mt-4 max-w-md text-body">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag-pill-soft">
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-8 inline-flex items-center gap-2.5 text-sm font-semibold text-fg">
            View case study
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-accent-red group-hover:bg-accent-red group-hover:text-white">
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-px"
                aria-hidden="true"
              />
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Desktop: vertical scroll drives a pinned, horizontally-scrubbing row
 * (classic GSAP ScrollTrigger recipe — pin:true + a function-based `end`
 * so it recalculates the pin distance on resize). Below `lg`, and for
 * prefers-reduced-motion, this same markup is just a native horizontal
 * scroll-snap carousel — no JS, no page-jacking.
 *
 * The heading lives *inside* the pinned viewport so the pinned frame is
 * exactly one screen tall with heading and cards balanced in it. Keeping
 * the heading outside meant the section ran a full screen taller than its
 * content and left a dead band above and below the card.
 */
export default function HorizontalShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Tracks which panel is centered in the native carousel (mobile, or any
  // width under prefers-reduced-motion) so the prev/next buttons can
  // disable at the ends. No-ops on the desktop pinned/scrubbed track: GSAP
  // moves the row via `transform`, which doesn't fire scroll events on it.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    function handleScroll() {
      const panels = row!.querySelectorAll<HTMLElement>(".showcase-panel");
      let closest = 0;
      let closestDistance = Infinity;
      panels.forEach((panel, i) => {
        const distance = Math.abs(panel.offsetLeft - row!.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = i;
        }
      });
      setActiveIndex(closest);
    }

    row.addEventListener("scroll", handleScroll, { passive: true });
    return () => row.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToIndex(index: number) {
    const row = rowRef.current;
    if (!row) return;
    const clamped = Math.max(0, Math.min(PROJECTS.length - 1, index));
    const panel = row.querySelectorAll<HTMLElement>(".showcase-panel")[clamped];
    panel?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const row = rowRef.current;
        if (!section || !row) return;

        // Measured off the last panel rather than `row.scrollWidth`, which
        // silently drops a flex container's trailing padding — that made the
        // track stop 416px early and park the last card flush against the
        // right edge instead of in its gutter.
        const travel = () => {
          const panels = row.querySelectorAll<HTMLElement>(".showcase-panel");
          const last = panels[panels.length - 1];
          if (!last) return 0;
          const gutter = parseFloat(getComputedStyle(row).paddingRight) || 0;
          return Math.max(0, last.offsetLeft + last.offsetWidth + gutter - section.clientWidth);
        };

        const tween = gsap.to(row, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            pin: true,
            // Framer Motion's route-transition wrapper (PageTransition)
            // animates `transform`/`filter` on an ancestor of this section,
            // which makes it a new containing block for `position: fixed`
            // descendants — GSAP's default pin type. Forcing "transform"
            // pinning sidesteps that entirely (it simulates the pin with a
            // computed transform instead of relying on native fixed
            // positioning), so it stays correct regardless of ancestor
            // styling.
            pinType: "transform",
            scrub: 0.6,
            end: () => `+=${travel()}`,
            invalidateOnRefresh: true,
            // The desktop track has no scrollbar of its own (the page's
            // vertical scroll drives it), so without this the section gives
            // no hint that there is more to the right.
            onUpdate: (self) => {
              if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress });
            },
          },
        });
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section className="border-t border-line bg-bg">
      <div
        ref={sectionRef}
        className="relative flex flex-col justify-center py-20 sm:py-24 lg:py-0 lg:motion-safe:h-screen lg:motion-safe:overflow-hidden"
      >
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 className="mt-3 text-h2 text-fg">Case studies</h2>
            </div>
            <Link href="/portfolio" data-cursor-hover className="btn-pill-outline">
              View all work
            </Link>
          </div>
        </div>

        <div
          ref={rowRef}
          className={`mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-6 sm:px-6 lg:mt-[clamp(1.5rem,4vh,3rem)] lg:gap-8 lg:pb-0 lg:motion-safe:snap-none lg:motion-safe:overflow-visible ${TRACK_GUTTER}`}
        >
          {PROJECTS.map((project, index) => (
            <ShowcasePanel key={project.slug} project={project} index={index} />
          ))}
        </div>

        <div className="mx-auto hidden w-full max-w-6xl px-4 pt-[clamp(1.5rem,4vh,3rem)] sm:px-6 lg:px-8 lg:motion-safe:block">
          <div className="flex items-center gap-5">
            <span className="relative h-px flex-1 overflow-hidden bg-line" aria-hidden="true">
              <span
                ref={progressRef}
                className="absolute inset-0 origin-left scale-x-0 bg-accent-red"
              />
            </span>
            <span className="text-caption">Scroll</span>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl justify-center gap-4 px-4 pt-8 sm:px-6 lg:motion-safe:hidden">
          <button
            type="button"
            data-cursor-hover
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous case study"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-red text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            data-cursor-hover
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === PROJECTS.length - 1}
            aria-label="Next case study"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-red text-white transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
