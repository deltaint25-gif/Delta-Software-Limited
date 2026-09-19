"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import { ArrowRight } from "lucide-react";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/Reveal";
import { useTilt } from "@/lib/use-tilt";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { SERVICE_DETAILS } from "@/lib/constants";

function ServiceCard({ service, index }: { service: (typeof SERVICE_DETAILS)[number]; index: number }) {
  // useTilt owns the card's inline transform (spring-driven lift + scale —
  // this is the "magnetic" hover), so the card itself must carry no CSS
  // hover transform or the two would fight over the same property. Every
  // hover move below is on a child instead.
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();

  function setRefs(node: HTMLAnchorElement | null) {
    (tiltRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
    (glowRef as MutableRefObject<HTMLAnchorElement | null>).current = node;
  }

  return (
    <li>
      {/* Stagger caps out after a few cards: at eight items a linear ramp
          leaves the last one visibly lagging its own scroll position. */}
      <Reveal delay={Math.min(index, 4) * 0.06}>
        <Link
          ref={setRefs}
          href={`/services/${service.slug}`}
          data-cursor="project"
          onPointerMove={handlePointerMove}
          className="liquid-glow liquid-card group relative block overflow-hidden rounded-feature border border-line bg-surface p-6 sm:p-7"
        >
          <div className="flex items-start gap-5">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-accent-red/10 text-accent-red transition-colors duration-300 ease-out group-hover:bg-accent-red group-hover:text-white">
              <ServiceIcon name={service.icon} className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm font-bold tabular-nums text-fg-ghost">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-h3 text-fg transition-transform duration-300 ease-out group-hover:translate-x-1">
                  {service.title}
                </h3>
              </div>
              <p className="mt-2.5 text-body">{service.description}</p>

              {/* Always rendered, never revealed only on hover: a card whose
                  only affordance appears on :hover is unreachable by touch
                  and invisible to keyboard users. */}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-fg">
                Learn more
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-accent-red group-hover:bg-accent-red group-hover:text-white">
                  <ArrowRight
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-px"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </Reveal>
    </li>
  );
}

/**
 * Services as a sticky editorial column beside a scrolling stack of cards,
 * replacing the accordion that used to sit here.
 *
 * The accordion hid seven of eight services behind a click and gave the
 * section no hierarchy beyond a list of rows — every service looked equally
 * weightless, and the copy that sells them was collapsed by default. Here
 * every service states its own case as you pass it, while the positioning
 * line stays pinned alongside.
 *
 * The interaction vocabulary is deliberately the one already used by the
 * case-study cards — tilt, cursor-follow glow, the liquid gradient ring —
 * rather than a new set invented for this section.
 */
export default function ServicesShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-bg-alt">
      {/* Texture instead of a flat panel: a dot matrix on the `line` token so
          it reads in both themes, plus one warm ambient bloom. Both are
          decorative and sit behind everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [background-size:26px_26px] opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(239,65,54,0.12),transparent_65%)] blur-2xl"
      />

      <div className="section-py relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">What we build</p>
            <h2 className="mt-3 text-h1 text-fg">
              Software products engineered for growth, scale and performance.
            </h2>
            <p className="mt-6 max-w-md text-body-lg">
              Eight capabilities covering a product end to end — discovery and design, through
              build and integration, to long-term support.
            </p>
            <Link href="/services" data-cursor-hover className="btn-pill-outline mt-8">
              All services
            </Link>
          </div>

          <ol className="mt-12 space-y-4 lg:mt-0">
            {SERVICE_DETAILS.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
