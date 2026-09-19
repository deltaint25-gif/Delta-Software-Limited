"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

gsap.registerPlugin(Draggable, InertiaPlugin);

export default function TestimonialsSlider() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useGSAP(
    () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mql.matches);

      const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
      if (cards.length === 0) return;

      const getSnapPoints = () => cards.map((card) => -card.offsetLeft);
      const setActive = (index: number) => {
        activeIndexRef.current = index;
        setActiveIndex(index);
      };

      const [draggable] = Draggable.create(track, {
        type: "x",
        inertia: true,
        edgeResistance: 0.85,
        bounds: { minX: getSnapPoints()[cards.length - 1], maxX: 0 },
        snap: {
          x: getSnapPoints(),
        },
        onDragEnd() {
          const points = getSnapPoints();
          const closest = points.reduce(
            (best, point, index) =>
              Math.abs(point - this.x) < Math.abs(points[best] - this.x) ? index : best,
            0
          );
          setActive(closest);
        },
      });

      const onResize = () => {
        const points = getSnapPoints();
        draggable.applyBounds({ minX: points[cards.length - 1], maxX: 0 });
        draggable.vars.snap = { x: points };
        gsap.to(track, { x: points[activeIndexRef.current], duration: 0 });
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        draggable.kill();
      };
    },
    { scope: viewportRef }
  );

  const slideTo = (index: number) => {
    const duration = reducedMotion ? 0 : 0.5;
    const cards = gsap.utils.toArray<HTMLElement>(".testimonial-card");
    if (!trackRef.current || cards.length === 0) return;
    const clamped = gsap.utils.clamp(0, cards.length - 1, index);
    gsap.to(trackRef.current, {
      x: -cards[clamped].offsetLeft,
      duration,
      ease: "power3.out",
    });
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  };

  const handleStep = (direction: 1 | -1) => slideTo(activeIndex + direction);
  const handleDotClick = (index: number) => slideTo(index);

  return (
    <div>
      <div ref={viewportRef} className="overflow-hidden">
        <div ref={trackRef} className="flex w-max cursor-grab gap-6 active:cursor-grabbing">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="testimonial-card card-surface liquid-card w-[85vw] max-w-md flex-shrink-0 select-none p-8 sm:w-[420px]"
            >
              <Quote className="h-8 w-8 text-accent-red/25" aria-hidden="true" />
              <p className="mt-4 text-lg leading-relaxed text-fg">{testimonial.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-red/15 text-sm font-semibold text-accent-red"
                  aria-hidden="true"
                >
                  {initials(testimonial.name)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <button
              key={testimonial.name}
              type="button"
              data-cursor-hover
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === activeIndex}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-fg" : "w-1.5 bg-line"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            data-cursor-hover
            onClick={() => handleStep(-1)}
            disabled={activeIndex === 0}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-surface disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            data-cursor-hover
            onClick={() => handleStep(1)}
            disabled={activeIndex === TESTIMONIALS.length - 1}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-surface disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
