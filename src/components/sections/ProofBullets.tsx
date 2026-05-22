"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const bullets = [
  {
    label: "Scoped access",
    headline: "Least-privilege by default.",
    body: "Every agent only sees what it needs. Documented permission matrix. No high-risk action runs without approval.",
  },
  {
    label: "Full audit trail",
    headline: "Every action logged.",
    body: "Tool calls, inputs, outputs, approvers. Stored in your infrastructure. Exportable for compliance review.",
  },
  {
    label: "Human in the loop",
    headline: "Approval gates on anything risky.",
    body: "Customer-facing messages, writes to production, irreversible actions. Your team approves. Always.",
  },
];

export default function ProofBullets() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(cardsRef.current.children);

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1.1,
          delay: i * 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      gsap.to(".proof-cards", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-16 pt-32 pb-20"
    >
      <div className="relative max-w-6xl mx-auto">
        <div
          ref={cardsRef}
          className="proof-cards grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {bullets.map((b) => (
            <div
              key={b.label}
              className="
                border border-white/10 rounded-xl
                bg-[#13131c] p-7
                transition-all duration-300
                hover:bg-[#1a1a24] hover:border-white/20 hover:-translate-y-1
              "
            >
              <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-4 font-medium font-mono">
                {b.label}
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white leading-snug mb-3">
                {b.headline}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
