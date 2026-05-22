"use client";

import { useEffect } from "react";
import { invalidate } from "@react-three/fiber";
import { ScrollTrigger } from "@/lib/gsap";

// Mutable ref — read in useFrame (R3F) without causing React re-renders
export const scrollProgress = { value: 0 };

export function useScrollProgress(containerId = "scroll-container") {
  useEffect(() => {
    // Canvas runs frameloop="demand". We invalidate on each scroll tick, plus
    // keep invalidating for ~500ms after scroll stops so MathUtils.damp can
    // finish converging — otherwise the camera freezes mid-glide at scroll-end.
    const TAIL_MS = 500;
    let lastScrollAt = 0;
    let rafId: number | null = null;

    const tail = () => {
      if (performance.now() - lastScrollAt > TAIL_MS) {
        rafId = null;
        return;
      }
      invalidate();
      rafId = requestAnimationFrame(tail);
    };

    const trigger = ScrollTrigger.create({
      trigger: `#${containerId}`,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.value = self.progress;
        lastScrollAt = performance.now();
        invalidate();
        if (rafId === null) rafId = requestAnimationFrame(tail);
      },
    });

    return () => {
      trigger.kill();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [containerId]);

  return scrollProgress;
}
