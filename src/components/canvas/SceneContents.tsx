"use client";

import { useMemo } from "react";
import { useActiveIndex } from "@/hooks/useScrollProgress";
import { buildCameraPath } from "@/lib/cameraPath";
import { CameraRig } from "./CameraRig";
import { Starfield } from "./Starfield";
import { RepoNode } from "./RepoNode";
import type { RepoEntry } from "@/lib/types";

/**
 * Section order: [hero, ...repos, outro].
 * Repo node `i` in this array sits at path index `i + 1` (hero occupies index 0).
 */
export function SceneContents({ repos, reducedMotion }: { repos: RepoEntry[]; reducedMotion: boolean }) {
  const sectionCount = repos.length + 2;
  const { curve, nodePositions } = useMemo(() => buildCameraPath(sectionCount), [sectionCount]);
  const activeIndex = useActiveIndex();

  return (
    <>
      <ambientLight intensity={0.4} />
      <hemisphereLight intensity={0.3} color="#7dd3fc" groundColor="#1e1b4b" />
      <Starfield />
      {repos.map((repo, i) => (
        <RepoNode
          key={repo.id}
          index={i}
          position={nodePositions[i + 1]}
          language={repo.language}
          active={activeIndex === i + 1}
        />
      ))}
      {!reducedMotion && <CameraRig curve={curve} />}
      <fog attach="fog" args={["#05040f", 10, 90]} />
    </>
  );
}
