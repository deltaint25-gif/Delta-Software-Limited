"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import MagneticButton from "@/components/MagneticButton";
import { useLiquidGlow } from "@/lib/use-liquid-glow";

interface CTASectionProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function CTASection({
  title,
  description,
  buttonLabel = "Contact Us",
  buttonHref = "/contact",
}: CTASectionProps) {
  const { ref: glowRef, handlePointerMove } = useLiquidGlow<HTMLAnchorElement>();

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="ambient-glow" aria-hidden="true" />
      <Reveal blur className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-h2 text-white">
          {title}
        </h2>
        {description && <p className="max-w-xl text-white/60">{description}</p>}
        <MagneticButton>
          <Link
            ref={glowRef}
            href={buttonHref}
            onPointerMove={handlePointerMove}
            className="liquid-glow-light relative overflow-hidden btn-pill-primary focus-visible:ring-offset-ink"
            data-cursor-hover
          >
            {buttonLabel}
          </Link>
        </MagneticButton>
      </Reveal>
    </section>
  );
}
