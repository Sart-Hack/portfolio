"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { Preload, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { useScrollProgress, scrollProgress } from "@/hooks/useScrollProgress";
import CircuitCity from "./CircuitCity";
import Particles from "./Particles";

function CameraController() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const t = scrollProgress.value;

    const angle = t * Math.PI * 1.5 - Math.PI * 0.25;
    const radius = 14 - t * 4;
    const height = 12 - t * 5;

    const targetX = Math.cos(angle) * radius;
    const targetZ = Math.sin(angle) * radius;
    const targetY = Math.max(3, height);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2, delta);

    const lookX = t < 0.5 ? -1 + t * 4 : 1;
    const lookZ = t < 0.5 ? -1 : -1 + (t - 0.5) * 4;
    camera.lookAt(
      THREE.MathUtils.damp(0, lookX, 2, delta),
      0,
      THREE.MathUtils.damp(0, lookZ, 2, delta)
    );
  });

  return null;
}

function SceneContent() {
  useScrollProgress();

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );

  return (
    <>
      <CameraController />
      <AdaptiveDpr pixelated />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 5]} intensity={1} color="#ffffff" />
      {!isMobile && (
        <directionalLight position={[-5, 10, -5]} intensity={0.3} color="#ffffff" />
      )}

      <CircuitCity />
      {!isMobile && <Particles />}

      <Preload all />
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [10, 12, 10], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
