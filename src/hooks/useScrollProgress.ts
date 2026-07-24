"use client";

import { useSyncExternalStore } from "react";
import { getScrollSnapshot, subscribeScroll } from "@/lib/scrollStore";

/** React-facing scroll progress (0..1). Re-renders on every scroll tick; use sparingly. */
export function useScrollProgress() {
  return useSyncExternalStore(
    subscribeScroll,
    () => getScrollSnapshot().progress,
    () => 0
  );
}

/** React-facing active section index. Only re-renders when the index actually changes. */
export function useActiveIndex() {
  return useSyncExternalStore(
    subscribeScroll,
    () => getScrollSnapshot().activeIndex,
    () => 0
  );
}
