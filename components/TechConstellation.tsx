"use client";

import { useState } from "react";
import { TECH_STACK, type TECH_CATEGORIES } from "@/lib/constants";

type Category = (typeof TECH_CATEGORIES)[number];

export default function TechConstellation() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  return (
    <div>
      <p className="text-caption h-5 text-center text-muted" aria-live="polite">
        {activeCategory ?? "Hover a technology to see its category"}
      </p>
      <div
        className="mt-6 flex flex-wrap justify-center gap-3"
        onMouseLeave={() => setActiveCategory(null)}
      >
        {TECH_STACK.map((tech) => {
          const isActive = activeCategory === tech.category;
          const isDimmed = activeCategory !== null && !isActive;
          return (
            <button
              key={tech.name}
              type="button"
              data-cursor-hover
              onMouseEnter={() => setActiveCategory(tech.category)}
              onFocus={() => setActiveCategory(tech.category)}
              onBlur={() => setActiveCategory(null)}
              className={`rounded-pill border px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                isActive
                  ? "scale-105 border-accent-red bg-accent-red/10 text-accent-red"
                  : isDimmed
                  ? "border-line text-muted opacity-40"
                  : "border-line text-fg hover:border-fg"
              }`}
            >
              {tech.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
