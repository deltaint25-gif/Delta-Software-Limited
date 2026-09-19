"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const STEP_COUNT = PROCESS_STEPS.length;

/**
 * The process rail: every step on one connected track, all four readable at
 * rest, with the track drawing itself and the nodes lighting up in sequence
 * as the section crosses the viewport.
 *
 * Deliberately NOT pinned. The previous version gave each step a full
 * viewport of scroll (400vh for four one-line steps) and showed exactly one
 * at a time, so the reader could never see where they had been or where they
 * were going — a "journey" you experience as a flipbook. It also sat
 * immediately after the case-study section, which *is* pinned, so the page
 * hijacked the scroll twice in a row. Scroll here only drives emphasis; it
 * never gates content, which is also what lets the reduced-motion path be
 * the same markup rather than a separate component.
 *
 * One set of markup for every breakpoint: a vertical rail when stacked, a
 * horizontal one from `lg`. Both tracks are absolutely positioned on the
 * list itself rather than stitched together from per-item segments, so the
 * grid's column gaps can't break the line.
 */
export default function StickyProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hFillRef = useRef<HTMLSpanElement>(null);
  const vFillRef = useRef<HTMLSpanElement>(null);
  const lastReached = useRef(-1);
  const reducedMotion = usePrefersReducedMotion();
  // With motion off, the rail is simply complete: nothing is dimmed and
  // nothing waits on a scroll position the reader may never reach.
  const [reached, setReached] = useState<number>(STEP_COUNT);

  useGSAP(
    () => {
      // usePrefersReducedMotion resolves after mount, so the first pass can run
      // with it still false — arming the scrub and emptying the rail — before
      // flipping true. Killing the trigger on that re-run doesn't undo either,
      // so the complete state has to be restored explicitly or the section is
      // left permanently blank for exactly the readers who can't scroll it
      // back to life.
      if (reducedMotion) {
        lastReached.current = STEP_COUNT;
        setReached(STEP_COUNT);
        gsap.set([hFillRef.current, vFillRef.current], { scaleX: 1, scaleY: 1 });
        return;
      }
      if (!sectionRef.current) return;

      // Start empty only once we know the scrubbed fill will actually run.
      setReached(0);
      lastReached.current = 0;
      gsap.set([hFillRef.current, vFillRef.current], { scaleX: 0, scaleY: 0 });

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        end: "bottom 60%",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          // Driven imperatively — a setState per scroll frame would re-render
          // the whole list dozens of times a second for a CSS transform.
          gsap.set(hFillRef.current, { scaleX: p });
          gsap.set(vFillRef.current, { scaleY: p });

          // Node i sits at i/STEP_COUNT along the track, so it lights the
          // moment the fill passes it.
          const next = p <= 0 ? 0 : Math.min(STEP_COUNT, Math.floor(p * STEP_COUNT) + 1);
          if (next !== lastReached.current) {
            lastReached.current = next;
            setReached(next);
          }
        },
      });
      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="border-t border-line bg-bg-alt">
      <div className="section-py mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">How we work</p>
        <h2 className="mt-3 text-h2 text-fg">An interactive journey, not a checklist</h2>

        {/* The horizontal track runs the full row and tapers out past the last
            node, so the line reads as "and it keeps going" rather than
            stopping dead — which is what step 04 actually says. */}
        <div className="relative mt-14 lg:mt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[7px] hidden h-px [mask-image:linear-gradient(to_right,black_82%,transparent)] lg:block"
          >
            <span className="absolute inset-0 bg-line" />
            <span
              ref={hFillRef}
              className="absolute inset-0 origin-left bg-accent-red"
              style={{ transform: "scaleX(1)" }}
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-[7px] top-[7px] w-px [mask-image:linear-gradient(to_bottom,black_92%,transparent)] lg:hidden"
          >
            <span className="absolute inset-0 bg-line" />
            <span
              ref={vFillRef}
              className="absolute inset-0 origin-top bg-accent-red"
              style={{ transform: "scaleY(1)" }}
            />
          </div>

          <ol className="relative grid gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
            {PROCESS_STEPS.map((step, index) => {
              const lit = index < reached;
              return (
                <li key={step.number} className="relative pl-8 lg:pl-0">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 block h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 ease-out lg:static ${
                      lit
                        ? "border-accent-red bg-accent-red"
                        : "border-line bg-bg-alt"
                    }`}
                  />
                  {/* Red stays on the rail and its nodes. Turning four large
                      numerals red as well shouts, and doubles a signal the
                      node already carries — so the numeral just resolves from
                      ghost to solid as the step is reached. */}
                  <p
                    className={`font-display text-4xl font-bold leading-none tabular-nums transition-colors duration-500 ease-out lg:mt-7 ${
                      lit ? "text-fg" : "text-fg-ghost"
                    }`}
                  >
                    {step.number}
                  </p>
                  <h3 className="mt-4 text-h3 text-fg">{step.title}</h3>
                  <p className="mt-3 max-w-sm text-body lg:max-w-none">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
