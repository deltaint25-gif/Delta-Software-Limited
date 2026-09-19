import { ArrowRight } from "lucide-react";
import { ENGINEERING_CAPABILITIES, ENGINEERING_PIPELINE } from "@/lib/constants";

export default function ProductEngineering() {
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {ENGINEERING_CAPABILITIES.map((capability) => (
          <span
            key={capability}
            className="rounded-pill border border-line px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted"
          >
            {capability}
          </span>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-1 gap-y-4">
        {ENGINEERING_PIPELINE.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-fg">
              {step}
            </div>
            {index < ENGINEERING_PIPELINE.length - 1 && (
              <ArrowRight className="mx-2 h-4 w-4 flex-shrink-0 text-muted" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
