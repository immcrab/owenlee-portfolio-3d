"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, CatmullRomCurve3 } from "three";
import { getScrollSnapshot } from "@/lib/scrollStore";

export function CameraRig({ curve }: { curve: CatmullRomCurve3 }) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new Vector3());
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const { progress } = getScrollSnapshot();
    const t = Math.min(0.999, Math.max(0, progress));
    const lookAheadT = Math.min(0.999, t + 0.01);

    const point = curve.getPointAt(t);
    const lookAt = curve.getPointAt(lookAheadT);

    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.03;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.03;

    camera.position.lerp(
      new Vector3(point.x + pointer.current.x * 1.2, point.y + pointer.current.y * 0.8, point.z + 6),
      1 - Math.pow(0.001, delta)
    );

    lookAtTarget.current.lerp(lookAt, 1 - Math.pow(0.001, delta));
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
