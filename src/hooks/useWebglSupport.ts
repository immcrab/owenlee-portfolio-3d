"use client";

import { useState } from "react";

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** Only ever rendered client-side (see the dynamic import of Scene), so the lazy
 * initializer running `document.createElement` here is safe and has no SSR pass to mismatch. */
export function useWebglSupport(): boolean {
  const [supported] = useState(detectWebgl);
  return supported;
}
