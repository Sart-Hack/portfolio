"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollProgress } from "@/hooks/useScrollProgress";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Building {
  x: number;
  z: number;
  width: number;
  depth: number;
  maxHeight: number;
  district: number;
  threshold: number;
  color: THREE.Color;
  accentColor: THREE.Color;
}

function generateBuildings(): Building[] {
  const buildings: Building[] = [];
  const gridSize = 12;
  const spacing = 1.2;

  for (let gx = -gridSize; gx <= gridSize; gx++) {
    for (let gz = -gridSize; gz <= gridSize; gz++) {
      const seed = gx * 1000 + gz;
      const r = seededRandom(seed);

      if (r < 0.35) continue;

      let district: number;
      if (gx <= 0 && gz <= 0) district = 0;
      else if (gx > 0 && gz <= 0) district = 1;
      else if (gx <= 0 && gz > 0) district = 2;
      else district = 3;

      const distFromCenter = Math.sqrt(gx * gx + gz * gz);
      const heightBase = Math.max(0.3, 3.5 - distFromCenter * 0.2);
      const heightVariation = seededRandom(seed + 1) * 2;

      // Minimal monochrome palette — warm whites and cool grays
      const warmth = seededRandom(seed + 6);
      const baseGray = 0.85 + warmth * 0.12;
      // Slight warm/cool tint per district instead of saturated colors
      const tintR = district % 2 === 0 ? baseGray + 0.02 : baseGray - 0.01;
      const tintG = baseGray;
      const tintB = district % 2 === 0 ? baseGray - 0.01 : baseGray + 0.02;

      buildings.push({
        x: gx * spacing + seededRandom(seed + 2) * 0.3,
        z: gz * spacing + seededRandom(seed + 3) * 0.3,
        width: 0.3 + seededRandom(seed + 4) * 0.5,
        depth: 0.3 + seededRandom(seed + 5) * 0.5,
        maxHeight: heightBase + heightVariation,
        district,
        threshold: 0.05 + (distFromCenter / gridSize) * 0.25 + district * 0.15,
        color: new THREE.Color(tintR, tintG, tintB),
        accentColor: new THREE.Color(
          Math.min(1, tintR + 0.08),
          Math.min(1, tintG + 0.08),
          Math.min(1, tintB + 0.08)
        ),
      });
    }
  }

  return buildings;
}

function DataFlowLines() {
  const materialRefs = useRef<THREE.LineBasicMaterial[]>([]);

  const lines = useMemo(() => {
    const paths: { points: THREE.Vector3[]; district: number }[] = [];

    const districtPaths = [
      [[-4, -4], [-2, -4], [-2, -2], [-4, -2], [-4, 0], [-2, 0], [0, 0]],
      [[2, -4], [4, -4], [4, -2], [6, -2], [6, 0], [4, 0], [2, 0]],
      [[-4, 2], [-2, 2], [-2, 4], [-4, 4], [-4, 6], [-2, 6], [0, 6]],
      [[6, 2], [4, 2], [4, 4], [2, 4], [2, 6], [0, 6]],
    ];

    districtPaths.forEach((path, district) => {
      const points = path.map(
        ([x, z]) => new THREE.Vector3(x * 0.6, 0.02, z * 0.6)
      );
      paths.push({ points, district });
    });

    return paths;
  }, []);

  useFrame((state) => {
    const scroll = scrollProgress.value;
    const time = state.clock.elapsedTime;

    materialRefs.current.forEach((mat, i) => {
      if (!mat) return;
      const line = lines[i];
      const activationPoint = line.district * 0.2 + 0.1;
      const progress = Math.max(0, (scroll - activationPoint) / 0.25);
      mat.opacity = Math.min(1, progress) * (0.2 + Math.sin(time * 2 + i) * 0.1);
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(line.points.flatMap((p) => [p.x, p.y, p.z])),
                3,
              ]}
              count={line.points.length}
            />
          </bufferGeometry>
          <lineBasicMaterial
            ref={(el) => {
              if (el) materialRefs.current[i] = el;
            }}
            color="#b0b0b0"
            transparent
            opacity={0}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}

function GroundPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScroll;
        varying vec3 vWorldPos;

        void main() {
          vec2 grid = abs(fract(vWorldPos.xz * 0.8) - 0.5);
          float gridLine = min(grid.x, grid.y);
          float gridAlpha = 1.0 - smoothstep(0.0, 0.015, gridLine);

          float dist = length(vWorldPos.xz);

          // Ripple wave emanating from center
          float wave = sin(dist * 3.0 - uTime * 1.2) * 0.5 + 0.5;
          wave *= smoothstep(20.0, 0.0, dist);

          float activation = smoothstep(0.0, 0.3, uScroll);

          vec3 color = vec3(0.75);
          float alpha = (gridAlpha * 0.06 + wave * 0.015) * activation;
          alpha *= smoothstep(18.0, 6.0, dist);

          gl_FragColor = vec4(color, alpha);
        }
      `,
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uScroll.value = scrollProgress.value;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        args={[shader]}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Buildings({ buildings }: { buildings: Building[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const currentHeights = useRef<Float32Array>(
    new Float32Array(buildings.length)
  );

  useEffect(() => {
    if (!meshRef.current) return;

    buildings.forEach((b, i) => {
      meshRef.current!.setColorAt(i, b.color.clone());
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [buildings]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const scroll = scrollProgress.value;
    const time = state.clock.elapsedTime;

    buildings.forEach((b, i) => {
      const activationProgress = Math.max(
        0,
        Math.min(1, (scroll - b.threshold) / 0.15)
      );
      const targetHeight = b.maxHeight * activationProgress;

      currentHeights.current[i] = THREE.MathUtils.damp(
        currentHeights.current[i],
        targetHeight,
        5,
        delta
      );

      const h = currentHeights.current[i];

      if (h < 0.01) {
        dummy.scale.set(0, 0, 0);
      } else {
        dummy.position.set(b.x, h / 2, b.z);
        dummy.scale.set(b.width, h, b.depth);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Very subtle brightness pulse when fully active
      const brightness = activationProgress * (0.03 + Math.sin(time * 0.8 + i * 0.3) * 0.015);
      const color = b.color.clone().lerp(b.accentColor, brightness);
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, buildings.length]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.05}
        roughness={0.7}
        toneMapped
      />
    </instancedMesh>
  );
}

export default function CircuitCity() {
  const buildings = useMemo(() => generateBuildings(), []);

  return (
    <group>
      <GroundPlane />
      <Buildings buildings={buildings} />
      <DataFlowLines />
    </group>
  );
}
