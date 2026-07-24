"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useWebglSupport } from "@/hooks/useWebglSupport";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SceneContents } from "./SceneContents";
import { Effects } from "./Effects";
import type { RepoEntry } from "@/lib/types";

export function Scene({ repos }: { repos: RepoEntry[] }) {
  const webglSupported = useWebglSupport();
  const reducedMotion = useReducedMotion();

  if (!webglSupported) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#1e1b4b,_#05040f_70%)]"
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 200 }}
      >
        <color attach="background" args={["#05040f"]} />
        <Suspense fallback={null}>
          <SceneContents repos={repos} reducedMotion={reducedMotion} />
          {!reducedMotion && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  );
}
