"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const trails = trailRefs.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => { mouse.current.x = e.clientX; mouse.current.y = e.clientY; };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button'], input, textarea, [data-hover]")) {
        gsap.to(ring, { scale: 1.8, opacity: 0.15, duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 1.5, duration: 0.3, ease: "power2.out" });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button'], input, textarea, [data-hover]")) {
        gsap.to(ring, { scale: 1, opacity: 0.3, duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    const animate = () => {
      const { x, y } = mouse.current;
      gsap.set(dot, { x, y });
      gsap.to(ring, { x, y, duration: 0.15, ease: "power2.out" });
      trails.forEach((trail, i) => { gsap.to(trail, { x, y, duration: 0.3 + i * 0.08, ease: "power2.out" }); });
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    gsap.to([dot, ring, ...trails], { opacity: 1, duration: 0.5, delay: 0.5 });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{ width: 4 - i * 0.5, height: 4 - i * 0.5, borderRadius: "50%", backgroundColor: `rgba(255,255,255,${0.15 - i * 0.025})` }}
        />
      ))}
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 opacity-0" style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)" }} />
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 opacity-0" style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ffffff" }} />
    </>
  );
}
