"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { lenisInstance } from "@/lib/lenis-instance";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      lenisInstance.current = null;
      return;
    }

    lenisInstance.current = lenisRef.current?.lenis ?? null;

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenisInstance.current = null;
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      autoRaf={false}
      options={{ lerp: 0.1, duration: 1.2, wheelMultiplier: 1 }}
    >
      {children}
    </ReactLenis>
  );
}
