"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Play, Pause, Globe, Smartphone, Layers, Building2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import MockupFrame from "@/components/MockupFrame";
import Reveal from "@/components/Reveal";
import { PROJECTS } from "@/lib/constants";

const REEL_FRAME_SECONDS = 3.2;

const CATEGORIES = [
  {
    title: "Web Applications",
    description: "Fast, accessible web apps built for real workflows, not demos.",
    icon: Globe,
  },
  {
    title: "Mobile Applications",
    description: "Native and cross-platform apps that feel at home on iOS and Android.",
    icon: Smartphone,
  },
  {
    title: "SaaS Platforms",
    description: "Multi-tenant products engineered to scale from first customer to thousandth.",
    icon: Layers,
  },
  {
    title: "Enterprise Systems",
    description: "Internal tools and integrations that keep complex operations running smoothly.",
    icon: Building2,
  },
] as const;

export default function Showreel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      if (!playing) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const interval = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
        }, REEL_FRAME_SECONDS * 1000);
        return () => clearInterval(interval);
      });
      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [playing] }
  );

  const activeProject = PROJECTS[activeIndex];

  return (
    <section id="showreel" ref={containerRef} className="scroll-mt-24 bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Showreel"
            title="Our work in motion"
            description="See how strategy, design, and engineering come together to build exceptional digital experiences."
          />
        </div>

        <Reveal blur>
          <div className="glass-dark relative mt-12 shadow-elevation-3">
            <div className="aspect-video w-full">
              {PROJECTS.map((project, index) => (
                <div
                  key={project.name}
                  aria-hidden={index !== activeIndex}
                  className="absolute inset-0 transition-opacity duration-700 ease-out"
                  style={{ opacity: index === activeIndex ? 1 : 0 }}
                >
                  <MockupFrame variant={project.variant} className="h-full w-full" />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <button
              type="button"
              data-cursor="video"
              onClick={() => setPlaying((prev) => !prev)}
              aria-label={playing ? "Pause showreel" : "Play showreel"}
              aria-pressed={playing}
              className="absolute bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
            </button>
            <div className="absolute bottom-6 right-6 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Now showing</p>
              <p className="mt-1 text-sm font-medium text-white">{activeProject.name}</p>
            </div>
            <div className="absolute left-6 top-6 flex gap-1.5">
              {PROJECTS.map((project, index) => (
                <span
                  key={project.name}
                  className={`h-1 w-6 rounded-full transition-colors duration-300 ${
                    index === activeIndex ? "bg-accent-red" : "bg-white/25"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.06}>
              <div className="card-surface liquid-card h-full p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-red/15 text-accent-red">
                  <category.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-h4 text-fg">{category.title}</h3>
                <p className="mt-2 text-sm text-muted">{category.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
