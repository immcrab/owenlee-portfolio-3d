"use client";

type Listener = () => void;

interface ScrollSnapshot {
  progress: number;
  velocity: number;
  activeIndex: number;
}

let snapshot: ScrollSnapshot = { progress: 0, velocity: 0, activeIndex: 0 };
const listeners = new Set<Listener>();

export function setScrollSnapshot(next: ScrollSnapshot) {
  snapshot = next;
  listeners.forEach((l) => l());
}

export function subscribeScroll(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getScrollSnapshot() {
  return snapshot;
}
