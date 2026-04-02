"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!isMounted || isTouch) return;

    const glow = glowRef.current;
    if (!glow) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button'], input, textarea, [data-hover]")) {
        gsap.to(glow, { scale: 2.5, opacity: 0.5, duration: 0.3, ease: "power2.out" });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button'], input, textarea, [data-hover]")) {
        gsap.to(glow, { scale: 1, opacity: 0.3, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    const animate = () => {
      gsap.to(glow, {
        x: mouse.current.x,
        y: mouse.current.y,
        duration: 0.4,
        ease: "power2.out",
      });
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    gsap.to(glow, { opacity: 0.3, duration: 0.5, delay: 0.5 });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isMounted, isTouch]);

  // Render nothing on server and on first client render to avoid hydration mismatch
  if (!isMounted || isTouch) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 opacity-0"
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
        filter: "blur(2px)",
      }}
    />
  );
}
