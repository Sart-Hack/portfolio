"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export default function GlitchText({
  text,
  className = "",
  as: Tag = "h1",
  delay = 0,
}: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
      }
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, [delay]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={`relative inline-block ${className}`}
      style={{ opacity: 0 }}
    >
      {text}
    </Tag>
  );
}
