"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { scrollProgress } from "@/hooks/useScrollProgress";

function DataNode({
  radius,
  speed,
  offset,
  color,
}: {
  radius: number;
  speed: number;
  offset: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    const scroll = scrollProgress.value;

    // Spread outward as user scrolls through hero (0-0.25)
    const spreadFactor = 1 + scroll * 0.5;

    ref.current.position.x =
      Math.cos(t) * radius * spreadFactor;
    ref.current.position.y =
      Math.sin(t * 0.7) * radius * 0.6 * spreadFactor;
    ref.current.position.z =
      Math.sin(t) * radius * spreadFactor;
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        wireframe
      />
    </mesh>
  );
}

function ConnectionLines({ nodeCount }: { nodeCount: number }) {
  const linesRef = useRef<(THREE.BufferGeometry | null)[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  // Create line points that will be updated each frame
  const lineData = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => ({
        radius: 1.2 + (i % 3) * 0.4,
        speed: 0.3 + (i % 4) * 0.15,
        offset: (i * Math.PI * 2) / nodeCount,
      })),
    [nodeCount]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scroll = scrollProgress.value;
    const spreadFactor = 1 + scroll * 0.5;

    groupRef.current.children.forEach((child, i) => {
      if (!(child instanceof THREE.Line) || !lineData[i]) return;
      const { radius, speed, offset } = lineData[i];
      const time = t * speed + offset;

      const positions = child.geometry.attributes.position;
      if (!positions) return;

      // Start at origin
      positions.setXYZ(0, 0, 0, 0);
      // End at node position
      positions.setXYZ(
        1,
        Math.cos(time) * radius * spreadFactor,
        Math.sin(time * 0.7) * radius * 0.6 * spreadFactor,
        Math.sin(time) * radius * spreadFactor
      );
      positions.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {lineData.map((_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(6), 3]}
              count={2}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.15}
          />
        </line>
      ))}
    </group>
  );
}

export default function NeuralSphere() {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const nodeCount = 10;
  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => ({
        radius: 1.2 + (i % 3) * 0.4,
        speed: 0.3 + (i % 4) * 0.15,
        offset: (i * Math.PI * 2) / nodeCount,
        color: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#00f0ff" : "#22c55e",
      })),
    []
  );

  useFrame((state, delta) => {
    if (!coreRef.current || !innerRef.current || !groupRef.current) return;

    const scroll = scrollProgress.value;
    const t = state.clock.elapsedTime;

    // Core wireframe rotation — faster with scroll
    const rotSpeed = 0.15 + scroll * 0.3;
    coreRef.current.rotation.y += delta * rotSpeed;
    coreRef.current.rotation.x += delta * rotSpeed * 0.3;

    // Pulsing inner sphere
    const pulse = Math.sin(t * 2) * 0.1 + 0.9;
    innerRef.current.scale.setScalar(pulse * 0.7);

    // Emissive intensity pulse
    const material = coreRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.4;

    // Fade and shrink as we scroll past hero into about
    const opacity = scroll < 0.3 ? 1 : Math.max(0.2, 1 - (scroll - 0.3) * 2);
    const scale = scroll < 0.3 ? 1 : Math.max(0.4, 1 - (scroll - 0.3) * 0.8);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, scale, 4, delta)
    );
    material.opacity = THREE.MathUtils.damp(material.opacity, opacity, 4, delta);
  });

  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.1}>
      <group ref={groupRef} position={[0, 0.5, 0]}>
        {/* Core wireframe icosahedron */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Inner solid sphere */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#0a0a2e"
            emissive="#00f0ff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Orbiting data nodes */}
        {nodes.map((node, i) => (
          <DataNode key={i} {...node} />
        ))}

        {/* Connection lines from center to nodes */}
        <ConnectionLines nodeCount={nodeCount} />
      </group>
    </Float>
  );
}
