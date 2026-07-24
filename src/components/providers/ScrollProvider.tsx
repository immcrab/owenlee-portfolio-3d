"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { setScrollSnapshot } from "@/lib/scrollStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProvider({
  children,
  sectionCount,
}: {
  children: React.ReactNode;
  sectionCount: number;
}) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const toActiveIndex = (progress: number) =>
      Math.min(sectionCount - 1, Math.max(0, Math.round(progress * (sectionCount - 1))));

    if (reducedMotion) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        setScrollSnapshot({ progress, velocity: 0, activeIndex: toActiveIndex(progress) });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ({ progress, velocity }: { progress: number; velocity: number }) => {
      setScrollSnapshot({ progress, velocity, activeIndex: toActiveIndex(progress) });
    });

    let frame: number;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion, sectionCount]);

  return <>{children}</>;
}
