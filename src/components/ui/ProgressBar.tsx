"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 h-[3px] w-full bg-white/5"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-indigo-400 via-sky-300 to-fuchsia-400"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
