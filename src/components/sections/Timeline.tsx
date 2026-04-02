"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { experiences } from "@/data/experience";
import TextReveal from "@/components/ui/TextReveal";

const accentColorMap = {
  amber: { dot: "bg-white", text: "text-gray-200", border: "border-white/8" },
  orange: { dot: "bg-gray-500", text: "text-gray-200", border: "border-white/8" },
  gold: { dot: "bg-gray-600", text: "text-gray-300", border: "border-white/8" },
};

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      const line = lineRef.current!;
      const lineLength = line.getTotalLength();
      gsap.set(line, { strokeDasharray: lineLength, strokeDashoffset: lineLength });

      gsap.to(line, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "bottom 40%", scrub: 1.5 },
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const isLeft = i % 2 === 0;

        gsap.from(card, {
          x: isLeft ? -80 : 80, y: 40, opacity: 0, scale: 0.9, duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
        });

        const dot = card.querySelector(".timeline-dot");
        if (dot) {
          gsap.from(dot, {
            scale: 0, opacity: 0, duration: 0.5, ease: "back.out(3)", delay: 0.3,
            scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none none" },
          });
        }

        gsap.to(card, {
          yPercent: -(3 + i * 1.5), ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[150vh] px-6 md:px-16 py-32">
      {/* no backdrop */}

      <div className="relative">
        <TextReveal as="h2" className="text-2xl md:text-4xl font-semibold tracking-tight text-white text-center mb-20" splitType="chars">
          Experience
        </TextReveal>

        <div className="relative max-w-4xl mx-auto">
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[1px]" style={{ overflow: "visible" }}>
            <line ref={lineRef} x1="0" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>

          <div className="relative space-y-20 md:space-y-28">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              const colors = accentColorMap[exp.accent];

              return (
                <div
                  key={`${exp.company}-${exp.period}`}
                  ref={(el) => { cardsRef.current[i] = el; }}
                  className={`relative flex ${isLeft ? "md:justify-start" : "md:justify-end"} justify-center`}
                >
                  <div className={`timeline-dot absolute left-1/2 -translate-x-1/2 top-7 w-2 h-2 rounded-full ${colors.dot} z-10 hidden md:block ring-[3px] ring-[#0a0a0f]`} />

                  <div className={`w-full md:w-[44%] border ${colors.border} bg-white/[0.15] rounded-xl p-7 transition-all duration-300 hover:bg-white/20 hover:border-white/15 hover:-translate-y-0.5`}>
                    <div className={`text-[11px] uppercase tracking-[0.18em] ${colors.text} mb-3 font-medium`}>
                      {exp.period}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-white leading-tight">
                      {exp.title}
                    </h3>
                    <div className="text-gray-200 mt-1.5">{exp.company}</div>
                    <div className="text-gray-300 text-sm mt-3 flex items-center gap-2">
                      <span>{exp.location}</span>
                      <span className="text-white/10">/</span>
                      <span>{exp.type}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
