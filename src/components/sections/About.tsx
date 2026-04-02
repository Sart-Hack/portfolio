"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";
import StatCounter from "@/components/ui/StatCounter";

const stats = [
  { value: 2, suffix: "+", label: "Years at IgniteTech", isText: false, displayValue: "" },
  { value: 0, suffix: "", label: "AI & Full-Stack", isText: true, displayValue: "AI & FS" },
  { value: 0, suffix: "", label: "DTU, Computer Science", isText: true, displayValue: "DTU" },
  { value: 10, suffix: "+", label: "AI Products Shipped", isText: false, displayValue: "" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;

    const cards = Array.from(cardsRef.current.children);

    const ctx = gsap.context(() => {
      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scaleX: 0, duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger: dividerRef.current, start: "top 90%", toggleActions: "play none none none" },
        });
      }

      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 100, opacity: 0, scale: 0.85, duration: 1.2, delay: i * 0.15, ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none none" },
        });
      });

      gsap.to(".about-text", {
        yPercent: -6, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      gsap.to(".about-cards", {
        yPercent: -18, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center px-6 md:px-16 py-32">
      {/* no backdrop — dark bg blends naturally with 3D scene */}

      <div className="relative max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="about-text">
          <TextReveal as="h2" className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-4" splitType="words">
            About
          </TextReveal>
          <div ref={dividerRef} className="h-[1px] w-12 bg-white/15 mb-8 origin-left" />
          <TextReveal as="div" className="text-base md:text-lg text-gray-200 leading-relaxed" stagger={0.04} scrub>
            <p className="mb-4">
              AI Innovation Specialist building enterprise AI products at
              IgniteTech. I work across the full stack — from training models to
              shipping production UIs.
            </p>
            <p>
              Currently focused on AI-powered solutions at Khoros and consulting
              for Voriq AI. Studying Computer Science at Delhi Technological
              University.
            </p>
          </TextReveal>
        </div>

        <div ref={cardsRef} className="about-cards grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="
                border border-white/8 rounded-xl p-6
                bg-white/[0.15]
                transition-all duration-300
                hover:bg-white/20 hover:border-white/15 hover:-translate-y-1
              "
            >
              <div className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
                {stat.isText ? stat.displayValue : <StatCounter target={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-sm text-gray-300 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
