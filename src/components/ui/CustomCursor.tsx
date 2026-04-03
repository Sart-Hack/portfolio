"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!isMounted || isTouch) return;

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
      // Smooth lerp for trailing effect
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
  }, [isMounted, isTouch]);

  if (!isMounted || isTouch) return null;

  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
    />
  );
}
