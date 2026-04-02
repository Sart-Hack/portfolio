"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  delay?: number;
  stagger?: number;
  scrub?: boolean;
  /** "lines" (default) — masked line slide. "words" — word-by-word pop. "chars" — character cascade. */
  splitType?: "lines" | "words" | "chars";
}

export default function TextReveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  stagger = 0.06,
  scrub = false,
  splitType = "lines",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const splitConfig =
      splitType === "chars"
        ? { type: "lines,words,chars" as const, mask: "lines" as const }
        : splitType === "words"
          ? { type: "lines,words" as const, mask: "lines" as const }
          : { type: "lines,words" as const, mask: "lines" as const };

    const split = SplitText.create(ref.current, {
      ...splitConfig,
      linesClass: "split-line",
    });

    const targets =
      splitType === "chars"
        ? split.chars
        : splitType === "words"
          ? split.words
          : split.lines;

    const ctx = gsap.context(() => {
      const baseAnimation = {
        yPercent: splitType === "lines" ? 110 : 80,
        opacity: 0,
        rotateX: splitType === "chars" ? -40 : 0,
        stagger: splitType === "chars" ? 0.02 : splitType === "words" ? 0.04 : stagger,
        ease: scrub ? "none" : "power4.out",
      };

      if (scrub) {
        gsap.from(targets, {
          ...baseAnimation,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            end: "top 45%",
            scrub: 1.5,
          },
        });
      } else {
        gsap.from(targets, {
          ...baseAnimation,
          duration: splitType === "chars" ? 0.7 : 1.1,
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    }, ref);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [delay, stagger, scrub, splitType]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={className}
      style={{ perspective: splitType === "chars" ? 600 : undefined }}
    >
      {children}
    </Tag>
  );
}
