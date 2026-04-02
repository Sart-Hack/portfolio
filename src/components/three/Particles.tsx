"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollProgress } from "@/hooks/useScrollProgress";

export default function Particles() {
  const ref = useRef<THREE.Points>(null);

  const count = typeof window !== "undefined" && window.innerWidth < 768 ? 150 : 400;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24;
      vel[i] = 0.15 + Math.random() * 0.3;
    }

    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    const scroll = scrollProgress.value;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const activation = Math.min(1, scroll * 4);

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += velocities[i] * delta * activation;

      if (arr[i * 3 + 1] > 10) {
        arr[i * 3 + 1] = 0;
        arr[i * 3] = (Math.random() - 0.5) * 24;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
    }

    posAttr.needsUpdate = true;
    ref.current.rotation.y += delta * 0.008;
  });

  const shader = useMemo(
    () => ({
      uniforms: {
        uColor: { value: new THREE.Color("#9ca3af") },
      },
      vertexShader: `
        varying float vAlpha;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 1.5 * (10.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
          vAlpha = smoothstep(0.0, 2.0, position.y) * smoothstep(10.0, 6.0, position.y);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vAlpha * 0.35;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    }),
    []
  );

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <shaderMaterial
        args={[shader]}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
