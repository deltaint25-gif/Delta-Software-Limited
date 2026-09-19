"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import { ArrowRight } from "lucide-react";
import { type DeviceMockupVariant } from "@/components/DeviceMockup";
import MockupFrame from "@/components/MockupFrame";
import MaskReveal from "@/components/MaskReveal";
import { useTilt } from "@/lib/use-tilt";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { useInView } from "@/lib/use-in-view";
import { useCountUp } from "@/lib/use-count-up";

interface CaseStudyRowProps {
  id?: string;
  name: string;
  summary: string;
  tags: readonly string[];
  variant: DeviceMockupVariant;
  challenge: string;
  approach: string;
  solution: string;
  metric: string;
  metricLabel: string;
  reversed?: boolean;
}

export default function CaseStudyRow({
  id,
  name,
  summary,
  tags,
  variant,
  challenge,
  approach,
  solution,
  metric,
  metricLabel,
  reversed = false,
}: CaseStudyRowProps) {
  const tiltRef = useTilt<HTMLDivElement>();
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLDivElement>();
  const imageInView = useInView(tiltRef, 0.2);
  const animatedMetric = useCountUp(metric, imageInView);

  const href = id ? `/portfolio/${id}` : undefined;

  function setRefs(node: HTMLDivElement | null) {
    (tiltRef as MutableRefObject<HTMLDivElement | null>).current = node;
    (glowRef as MutableRefObject<HTMLDivElement | null>).current = node;
  }

  return (
    <div id={id} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div
        ref={setRefs}
        data-cursor={href ? "project" : "image"}
        onPointerMove={handlePointerMove}
        className={`liquid-glow liquid-card relative h-64 overflow-hidden rounded-feature border border-line sm:h-80 lg:h-96 ${
          reversed ? "lg:order-2" : ""
        }`}
      >
        <MaskReveal className="h-full w-full" inView={imageInView}>
          {href ? (
            <Link href={href} data-cursor-hover aria-label={`View case study: ${name}`} className="block h-full w-full">
              <MockupFrame variant={variant} tone="surface" className="h-full w-full" />
            </Link>
          ) : (
            <MockupFrame variant={variant} tone="surface" className="h-full w-full" />
          )}
        </MaskReveal>
      </div>

      <div className={reversed ? "lg:order-1" : ""}>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="tag-pill-soft">
              {tag}
            </span>
          ))}
        </div>
        {href ? (
          <Link href={href} data-cursor-hover className="link-underline">
            <h2 className="mt-4 text-h2 text-fg">{name}</h2>
          </Link>
        ) : (
          <h2 className="mt-4 text-h2 text-fg">{name}</h2>
        )}
        <p className="mt-3 text-lg leading-relaxed text-muted">{summary}</p>

        <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-caption">Challenge</dt>
            <dd className="mt-2 text-sm leading-relaxed text-fg-dim">{challenge}</dd>
          </div>
          <div>
            <dt className="text-caption">Approach</dt>
            <dd className="mt-2 text-sm leading-relaxed text-fg-dim">{approach}</dd>
          </div>
          <div>
            <dt className="text-caption">Solution</dt>
            <dd className="mt-2 text-sm leading-relaxed text-fg-dim">{solution}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div className="inline-flex items-baseline gap-3 rounded-lg border border-line bg-fill-soft px-5 py-4">
            <span className="text-h2 tabular-nums text-accent-red">{animatedMetric}</span>
            <span className="text-sm text-muted">{metricLabel}</span>
          </div>

          {href && (
            <Link
              href={href}
              data-cursor-hover
              className="link-underline group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-fg lg:min-h-0"
            >
              View full case study
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
