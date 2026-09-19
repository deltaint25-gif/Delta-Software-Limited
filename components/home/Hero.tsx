"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroBackground from "./HeroBackground";
import HeroContentTop from "./HeroContentTop";
import HeroContentBottom from "./HeroContentBottom";
import Hero3DLogo from "./Hero3DLogo";
import HeroCursorFX from "./HeroCursorFX";
import HeroFooterRow from "./HeroFooterRow";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 140]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-first-view overflow-hidden bg-white text-slate-900">
      <HeroBackground />
      {/*
        DOM order is badge+heading, then paragraph+CTA, then the visual — so
        stacked (below `xl`) the whole value proposition reads before the
        visual and lands inside the first viewport. The 3D used to sit
        physically between the two copy halves, which pushed the CTA 97px
        below the fold on a 390px phone and 52px below on an 834px tablet.

        At `xl` the same three nodes recombine into the original two-column
        composition via explicit grid placement, so only one WebGL canvas
        ever mounts.

        Two columns start at `xl` (1280), not `lg` (1024): at 1032 the
        headline column was only 376px wide and "We Engineer What's Next."
        broke across five lines.

        Container is max-w-[1200px] with xl:px-14 rather than 1600: at 1920
        the text used to start at x=224 while the navbar logo starts at 416,
        so the hero visibly ignored the grid every other section follows.
        These numbers put the copy's left edge and the mark's right edge on
        exactly that column, mirrored.

        Vertical padding and the row gap are vh-clamped at every breakpoint,
        not fixed. With pt-24/pb-28 the block had one height regardless of
        viewport, so the CTA sat at y=728 whatever the screen was — cut off
        by 28px at 1536x700 and 88px at 1366x640, which is any 1080p display
        at 125% browser zoom or a short laptop. Each clamp's MAX is the value
        it replaced, so tall screens render identically and only short ones
        compress; that is what also brings the stacked layout back inside the
        fold at 1024x600 (landscape tablet) and 320x568.

        `min-h-first-view`, not `min-h-screen`: the navbar is sticky but in
        NORMAL FLOW, so a 100vh hero starts 89px down and ends 89px below
        the fold. Centring inside that box put the copy half a header-height
        too low at every size and pushed the CTA off screen on short ones.
      */}
      <div className="relative mx-auto grid min-h-first-view w-full max-w-[1200px] grid-cols-1 content-start items-start gap-y-[clamp(0.75rem,3.5vh,1.75rem)] px-5 pb-20 pt-[clamp(1rem,5vh,2rem)] sm:gap-y-[clamp(1rem,4vh,2rem)] sm:px-6 sm:pt-[clamp(1.5rem,6vh,3rem)] lg:px-8 xl:grid-cols-[minmax(0,47fr)_minmax(0,53fr)] xl:content-center xl:items-center xl:gap-x-8 xl:gap-y-[clamp(0.5rem,1.6vh,1.5rem)] xl:px-14 xl:pb-[clamp(2.5rem,7vh,7rem)] xl:pt-[clamp(1.5rem,5vh,6rem)]">
        <div className="relative xl:col-start-1 xl:row-start-1">
          <HeroContentTop />
        </div>

        <div className="relative xl:col-start-1 xl:row-start-2">
          <HeroContentBottom />
        </div>

        {/*
          `xl:justify-self-end` parks the mark on the same right-hand grid
          line the navbar ends on, mirroring the copy's left edge, and
          `max-w-[32rem]` (not a vw clamp) keeps the gap to the headline a
          constant 112px instead of ballooning to 189px at 1280.
        */}
        <motion.div
          className="relative mx-auto aspect-square w-[68vw] max-w-[280px] sm:max-w-[320px] md:max-w-[380px] xl:col-start-2 xl:row-start-1 xl:row-span-2 xl:mx-0 xl:w-full xl:max-w-[32rem] xl:justify-self-end xl:self-center"
          style={{ y: logoY, opacity: logoOpacity }}
        >
          <Hero3DLogo />
        </motion.div>
      </div>
      <HeroCursorFX containerRef={sectionRef} />
      <HeroFooterRow />
    </section>
  );
}
