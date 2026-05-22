"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    let raf: number;
    const animate = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      spotlight.style.background = `radial-gradient(
        300px circle at ${currentX}px ${currentY}px,
        rgba(255, 255, 255, 0.04) 0%,
        rgba(255, 255, 255, 0.015) 40%,
        transparent 70%
      )`;

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Hidden on touch devices via CSS — avoids hydration-mismatch / setState-in-effect.
  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none z-[9998] pointer-coarse:hidden"
    />
  );
}
