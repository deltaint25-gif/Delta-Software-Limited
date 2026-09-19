"use client";

import { useState, type MutableRefObject } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import { useTilt } from "@/lib/use-tilt";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { SERVICE_DETAILS } from "@/lib/constants";

type Service = (typeof SERVICE_DETAILS)[number];

function ServiceCard({
  service,
  index,
  hoveredIndex,
  onHover,
  onLeave,
}: {
  service: Service;
  index: number;
  hoveredIndex: number | null;
  onHover: (index: number) => void;
  onLeave: () => void;
}) {
  // Tilt sets its own inline transform on pointermove, so this card can't
  // also use a CSS :hover transform (e.g. card-surface's hover:-translate-y-1)
  // on the same element — the inline style would silently win every time.
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();

  function setRefs(node: HTMLAnchorElement | null) {
    (tiltRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
    (glowRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
  }

  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <Reveal delay={index * 0.05} className="h-full">
      <Link
        ref={setRefs}
        href={`/services/${service.slug}`}
        data-cursor="service"
        onPointerMove={handlePointerMove}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={onLeave}
        onFocus={() => onHover(index)}
        onBlur={onLeave}
        className={`liquid-glow liquid-card group relative block h-full overflow-hidden rounded-lg border border-line bg-surface p-6 transition-[box-shadow,border-color,opacity] duration-300 ease-out ${
          isDimmed ? "opacity-50" : "opacity-100"
        } ${isHovered ? "border-accent-red/40" : ""}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-red/15 text-accent-red transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3">
            <ServiceIcon name={service.icon} className="h-5 w-5" />
          </div>
          <span className="font-display text-2xl font-bold text-fg-ghost transition-colors duration-300 ease-out group-hover:text-accent-red/25">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-fg">{service.title}</h2>
        <p className="mt-2 text-sm text-muted">{service.description}</p>
        <span
          className={`mt-4 flex items-center gap-1.5 text-sm font-semibold text-accent-red transition-all duration-300 ease-out ${
            isHovered ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          Explore service
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </Link>
    </Reveal>
  );
}

/**
 * Interactive services grid: hovering a card lifts its own index/icon,
 * reveals an "Explore service" affordance, and gently dims its siblings
 * so attention narrows to the one being considered.
 */
export default function ServicesGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_DETAILS.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              hoveredIndex={hoveredIndex}
              onHover={setHoveredIndex}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
