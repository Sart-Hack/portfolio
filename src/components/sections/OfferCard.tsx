"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { BOOKING_URL } from "@/lib/config";

const included = [
  "Workflow audit and process map",
  "Three to five candidate workflows ranked by ROI and risk",
  "Tool permission matrix and data classification draft",
  "Recommended pilot scope with timeline and price",
  "30-minute readout call",
];

export default function OfferCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      const bulletEls = cardRef.current?.querySelectorAll("[data-offer-bullet]");
      if (bulletEls && bulletEls.length) {
        gsap.from(bulletEls, {
          x: -10,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-16"
    >
      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-16" aria-hidden="true">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/15" />
          <span className="text-[10px] uppercase tracking-[0.28em] text-gray-500 font-mono">
            The offer
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/15" />
        </div>
        <div
          ref={cardRef}
          className="
            relative
            border border-white/15 rounded-xl
            bg-[#13131c]
            p-8 md:p-12
            shadow-2xl shadow-black/40
          "
        >
          <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-4 font-medium font-mono">
            Offer
          </div>

          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            Agent Opportunity Audit
          </h2>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl md:text-2xl text-white font-semibold">
              $3,500
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-base md:text-lg text-gray-200">one week</span>
          </div>

          <div className="h-[1px] w-12 bg-white/15 mt-7 mb-7" />

          <p className="text-base md:text-lg text-gray-200 leading-relaxed">
            I map your highest-friction workflow, identify three to five
            automation candidates, and write you a deployment plan with risk
            and ROI estimates. No prototype, no commitment beyond the week.
          </p>

          <div className="mt-9">
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-4 font-medium font-mono">
              What you get
            </div>
            <ul className="space-y-2.5">
              {included.map((item) => (
                <li
                  key={item}
                  data-offer-bullet
                  className="flex items-start gap-3 text-sm md:text-base text-gray-200"
                >
                  <span className="text-[#7AB4E8] font-mono mt-0.5 select-none">
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                relative z-20 pointer-events-auto
                inline-flex items-center justify-center gap-2
                px-6 py-3
                border border-white/30 rounded-md
                bg-white text-[#0a0a0f] font-medium
                hover:bg-white/90 hover:border-white
                transition-colors
                w-full sm:w-auto
              "
              data-hover
            >
              Book a 30-minute call
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <span className="text-xs md:text-sm text-gray-400">
              We map your workflow. You decide if a paid Audit is worth it.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
