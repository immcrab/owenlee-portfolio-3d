import { CatmullRomCurve3, Vector3 } from "three";

// Deterministic PRNG so the path is identical between renders/reloads.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CameraPath {
  curve: CatmullRomCurve3;
  nodePositions: Vector3[];
}

/**
 * Builds a wandering curve through space, one control point per section.
 * Repo nodes sit exactly on the curve's control points so the camera drifts
 * past each one in turn as the user scrolls.
 */
export function buildCameraPath(sectionCount: number, seed = 1337): CameraPath {
  const rand = mulberry32(seed);
  const points: Vector3[] = [];

  for (let i = 0; i < sectionCount; i++) {
    const z = -i * 18;
    const swing = i === 0 ? 0 : 1;
    const x = Math.sin(i * 0.7) * 6 * swing + (rand() - 0.5) * 3 * swing;
    const y = Math.cos(i * 0.5) * 3 * swing + (rand() - 0.5) * 2 * swing;
    points.push(new Vector3(x, y, z));
  }

  const curve = new CatmullRomCurve3(points, false, "catmullrom", 0.5);
  return { curve, nodePositions: points };
}
