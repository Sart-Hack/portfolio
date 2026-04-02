"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";
import TypeWriter from "@/components/ui/TypeWriter";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -120,
        opacity: 0,
        scale: 0.92,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: -10,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "5% top",
            end: "20% top",
            scrub: true,
          },
        });
      }

      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          duration: 1.2,
          delay: 0.8,
          ease: "power3.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center px-4"
    >
      <div ref={contentRef} className="text-center" style={{ willChange: "transform, opacity, filter" }}>
        <TextReveal
          as="h1"
          className="text-5xl sm:text-6xl md:text-8xl font-semibold tracking-tight text-white"
          delay={0.2}
          splitType="chars"
        >
          Sarthak Gupta
        </TextReveal>

        <div
          ref={lineRef}
          className="mx-auto mt-6 h-[1px] w-16 bg-white/20 origin-center"
        />

        <div className="mt-5 text-lg md:text-xl text-gray-200">
          <TypeWriter text="AI Innovation Specialist" delay={900} speed={40} />
        </div>
        <div className="mt-3 text-sm text-gray-300">
          <TypeWriter
            text="IgniteTech  /  Khoros  /  Voriq AI"
            delay={2400}
            speed={25}
          />
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] text-gray-600 uppercase tracking-[0.25em] font-medium">
            Scroll
          </span>
          <div className="w-[1px] h-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-transparent animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
}
