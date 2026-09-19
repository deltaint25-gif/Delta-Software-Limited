import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INDUSTRIES } from "@/lib/constants";

export default function Industries() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {INDUSTRIES.map((industry) =>
        industry.relatedSlug ? (
          <Link
            key={industry.name}
            href={`/portfolio/${industry.relatedSlug}`}
            data-cursor-hover
            className="link-underline group inline-flex items-center gap-1.5 rounded-pill border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-fg"
          >
            {industry.name}
            <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        ) : (
          <span
            key={industry.name}
            className="rounded-pill border border-line px-5 py-2.5 text-sm font-medium text-fg"
          >
            {industry.name}
          </span>
        )
      )}
    </div>
  );
}
