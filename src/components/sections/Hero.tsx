"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";
import { BOOKING_URL } from "@/lib/config";

interface HeroProps {
  headline?: string;
  subhead?: string;
  body?: string;
  ctaCaption?: string;
}

export default function Hero({
  headline = "I build AI agents your security team will actually approve.",
  subhead = "For US tech companies past Series A that need agents, not chatbots.",
  body = "Your team wants agents that take real actions. Your security team wants to know what they can do, who approved it, and proof of what happened.",
  ctaCaption = "No pitch. We map your highest-friction workflow and you decide if a paid Audit is worth it.",
}: HeroProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
          delay: 0.6,
          ease: "power3.inOut",
        });
      }

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.9,
          delay: 1.4,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24"
    >
      <div
        ref={contentRef}
        className="text-center max-w-4xl"
        style={{ willChange: "transform, opacity, filter" }}
      >
        <TextReveal
          as="h1"
          className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1]"
          delay={0.1}
          splitType="words"
        >
          {headline}
        </TextReveal>

        <TextReveal
          as="p"
          className="mt-5 text-xl md:text-3xl text-gray-100 leading-snug max-w-3xl mx-auto font-medium"
          delay={0.5}
          splitType="words"
        >
          {subhead}
        </TextReveal>

        <div
          ref={lineRef}
          className="mx-auto mt-10 h-[1px] w-16 bg-white/20 origin-center"
        />

        <TextReveal
          as="p"
          className="mt-10 text-base md:text-lg text-gray-200 max-w-2xl mx-auto"
          delay={0.9}
          splitType="lines"
        >
          {body}
        </TextReveal>

        <div ref={ctaRef} className="mt-12 flex flex-col items-center gap-3">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative z-20 pointer-events-auto
              inline-flex items-center gap-2
              px-7 py-3.5
              border border-white/30 rounded-md
              bg-white text-[#0a0a0f] font-medium
              hover:bg-white/90 hover:border-white
              transition-colors
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
          <p className="text-xs md:text-sm text-gray-400 max-w-md">
            {ctaCaption}
          </p>
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
