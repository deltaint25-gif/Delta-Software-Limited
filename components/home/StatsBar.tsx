"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, HeartHandshake, Building2, LifeBuoy } from "lucide-react";
import { STATS } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const ICONS: ComponentType<{ className?: string }>[] = [Briefcase, HeartHandshake, Building2, LifeBuoy];

function parseStatValue(value: string): { target: number; prefix: string; suffix: string } {
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  if (!match) return { target: 0, prefix: "", suffix: value };
  const [, prefix, digits, suffix] = match;
  return { target: Number(digits), prefix, suffix };
}

function StatCard({ stat, Icon, index }: { stat: (typeof STATS)[number]; Icon: ComponentType<{ className?: string }>; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { target, prefix, suffix } = parseStatValue(stat.value);
  const [display, setDisplay] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (reducedMotion) setDisplay(target);
  }, [reducedMotion, target]);

  useGSAP(
    () => {
      if (reducedMotion) return;
      const card = cardRef.current;
      if (!card) return;
      const counter = { value: 0 };
      const tween = gsap.to(counter, {
        value: target,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => setDisplay(Math.round(counter.value)),
        scrollTrigger: { trigger: card, start: "top 88%", once: true },
      });
      return () => tween.kill();
    },
    { scope: cardRef, dependencies: [reducedMotion, target] }
  );

  return (
    <div
      ref={cardRef}
      className="liquid-card card-surface group relative overflow-hidden p-6 hover:border-accent-red/30 sm:p-8"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent-red/0 blur-2xl transition-all duration-500 group-hover:bg-accent-red/10"
        aria-hidden="true"
      />
      <Icon className="h-6 w-6 text-accent-red" />
      <p className="mt-5 font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">
        {prefix}
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted">{stat.label}</p>
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="border-t border-line bg-bg-alt">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} Icon={ICONS[index % ICONS.length]} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
