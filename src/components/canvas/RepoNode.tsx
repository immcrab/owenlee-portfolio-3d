"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Vector3 } from "three";
import { colorForLanguage } from "@/lib/languageColors";

const GEOMETRIES = ["icosahedron", "octahedron", "torus", "dodecahedron"] as const;

export function RepoNode({
  position,
  index,
  language,
  active,
}: {
  position: Vector3;
  index: number;
  language: string | null;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useMemo(() => colorForLanguage(language, index), [language, index]);
  const geometryKind = GEOMETRIES[index % GEOMETRIES.length];
  const targetScale = useRef(1);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x += delta * 0.12;
      const bob = Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.3;
      groupRef.current.position.y = position.y + bob;
    }
    targetScale.current = THREE.MathUtils.lerp(targetScale.current, active ? 1.35 : 1, 0.08);
    if (meshRef.current) {
      meshRef.current.scale.setScalar(targetScale.current);
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <mesh ref={meshRef}>
        {geometryKind === "icosahedron" && <icosahedronGeometry args={[1.6, 0]} />}
        {geometryKind === "octahedron" && <octahedronGeometry args={[1.7, 0]} />}
        {geometryKind === "torus" && <torusGeometry args={[1.3, 0.5, 16, 32]} />}
        {geometryKind === "dodecahedron" && <dodecahedronGeometry args={[1.5, 0]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.9 : 0.35}
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>
      <pointLight color={color} intensity={active ? 6 : 1.5} distance={12} />
    </group>
  );
}
