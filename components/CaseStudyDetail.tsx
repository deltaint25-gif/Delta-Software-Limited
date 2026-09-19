"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type DeviceMockupVariant } from "@/components/DeviceMockup";
import MockupFrame from "@/components/MockupFrame";
import MaskReveal from "@/components/MaskReveal";
import Reveal from "@/components/Reveal";
import { useTilt } from "@/lib/use-tilt";
import { useLiquidGlow } from "@/lib/use-liquid-glow";
import { useInView } from "@/lib/use-in-view";
import { useCountUp } from "@/lib/use-count-up";

export interface CaseStudyProject {
  name: string;
  slug: string;
  summary: string;
  tags: readonly string[];
  variant: DeviceMockupVariant;
  challenge: string;
  approach: string;
  solution: string;
  metric: string;
  metricLabel: string;
}

interface CaseStudyDetailProps {
  project: CaseStudyProject;
  allProjects: readonly CaseStudyProject[];
  index: number;
}

/**
 * Bespoke case-study hero + body — deliberately not the shared PageHeader
 * (used by every other page) so a case study reads as its own cinematic
 * moment: a dot rail doubling as first/prev/next navigation, a giant
 * title, then a tilt+glow signature visual instead of a plain framed image.
 */
export default function CaseStudyDetail({ project, allProjects, index }: CaseStudyDetailProps) {
  const total = allProjects.length;
  const prev = allProjects[(index - 1 + total) % total];
  const next = allProjects[(index + 1) % total];

  const tiltRef = useTilt<HTMLDivElement>(4);
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLDivElement>();
  const imageInView = useInView(tiltRef, 0.2);
  const animatedMetric = useCountUp(project.metric, imageInView);

  function setRefs(node: HTMLDivElement | null) {
    (tiltRef as MutableRefObject<HTMLDivElement | null>).current = node;
    (glowRef as MutableRefObject<HTMLDivElement | null>).current = node;
  }

  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="ambient-glow" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <span className="eyebrow-pill">
              <span className="eyebrow-pill-dot" aria-hidden="true" />
              Case study
            </span>

            <nav aria-label="Jump to a case study" className="flex items-center gap-1.5">
              {allProjects.map((item, i) => (
                <Link
                  key={item.slug}
                  href={`/portfolio/${item.slug}`}
                  data-cursor-hover
                  aria-current={i === index ? "page" : undefined}
                  // The dot is 6px; p-1 made the whole target 14x14, well under the 24x24
                  // WCAG 2.5.8 floor and near-unhittable on a phone. The hit area is
                  // now a proper touch box while the dot stays visually small.
                  className="group flex min-h-[44px] min-w-[44px] items-center justify-center sm:min-h-[28px] sm:min-w-[28px]"
                >
                  <span className="sr-only">{item.name}</span>
                  <span
                    aria-hidden="true"
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-6 bg-accent-red" : "w-1.5 bg-line-strong group-hover:bg-muted"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <span className="text-caption tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <h1 className="mt-6 text-display text-fg">{project.name}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag-pill-soft">
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <div
          ref={setRefs}
          data-cursor="image"
          onPointerMove={handlePointerMove}
          className="liquid-glow liquid-card relative mt-10 h-72 overflow-hidden rounded-feature border border-line sm:h-96 lg:h-[30rem]"
        >
          <MaskReveal className="h-full w-full" inView={imageInView}>
            <MockupFrame variant={project.variant} tone="surface" className="h-full w-full" />
          </MaskReveal>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            <div>
              <dt className="text-caption">Challenge</dt>
              <dd className="mt-3 text-base leading-relaxed text-fg-dim">{project.challenge}</dd>
            </div>
            <div>
              <dt className="text-caption">Approach</dt>
              <dd className="mt-3 text-base leading-relaxed text-fg-dim">{project.approach}</dd>
            </div>
            <div>
              <dt className="text-caption">Solution</dt>
              <dd className="mt-3 text-base leading-relaxed text-fg-dim">{project.solution}</dd>
            </div>
          </dl>

          <div className="mt-10 inline-flex items-baseline gap-3 rounded-lg border border-line bg-fill-soft px-5 py-4">
            <span className="text-h2 tabular-nums text-accent-red">{animatedMetric}</span>
            <span className="text-sm text-muted">{project.metricLabel}</span>
          </div>
        </Reveal>

        <div className="mt-16 border-t border-line pt-10">
          <div className="flex items-center justify-between">
            <Link
              href="/portfolio"
              data-cursor-hover
              className="link-underline inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-muted hover:text-fg lg:min-h-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              All work
            </Link>
            <span className="text-caption">
              Project {index + 1} of {total}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ProjectNavCard project={prev} direction="prev" />
            <ProjectNavCard project={next} direction="next" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectNavCard({ project, direction }: { project: CaseStudyProject; direction: "prev" | "next" }) {
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const isNext = direction === "next";

  return (
    <Link
      ref={tiltRef}
      href={`/portfolio/${project.slug}`}
      data-cursor="project"
      className={`liquid-card group flex items-center gap-4 overflow-hidden rounded-md border border-line bg-surface p-4 transition-colors duration-300 hover:border-line-strong ${isNext ? "sm:flex-row-reverse sm:text-right" : ""}`}
    >
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <MockupFrame
          variant={project.variant}
          tone="surface"
          className="h-full w-full"
          deviceClassName="transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-caption">{isNext ? "Next project" : "Previous project"}</span>
        <p className="mt-1 text-base font-semibold text-fg transition-colors group-hover:text-accent-red">
          {project.name}
        </p>
      </div>
      {isNext ? (
        <ArrowRight
          className="hidden h-4 w-4 flex-shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-red sm:block"
          aria-hidden="true"
        />
      ) : (
        <ArrowLeft
          className="hidden h-4 w-4 flex-shrink-0 text-muted transition-transform group-hover:-translate-x-1 group-hover:text-accent-red sm:block"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
