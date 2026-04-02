"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// Mutable ref — read in useFrame (R3F) without causing React re-renders
export const scrollProgress = { value: 0 };

export function useScrollProgress(containerId = "scroll-container") {
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: `#${containerId}`,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.value = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerId]);

  return scrollProgress;
}
