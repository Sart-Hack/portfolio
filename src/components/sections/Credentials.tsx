"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";

export default function Credentials() {
  const sectionRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scaleX: 0,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      if (bodyRef.current) {
        const paragraphs = bodyRef.current.querySelectorAll("p");
        gsap.from(paragraphs, {
          y: 20,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bodyRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }

      gsap.to(".cred-text", {
        yPercent: -4,
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
    <section ref={sectionRef} className="relative px-6 md:px-16 py-32">
      <div className="relative max-w-3xl mx-auto cred-text">
        <div className="rounded-2xl border border-white/8 bg-[#0a0a0f]/70 backdrop-blur-md px-8 py-10 md:px-12 md:py-14 shadow-2xl shadow-black/40">
          <TextReveal
            as="h2"
            className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-4"
            splitType="words"
          >
            Who you&apos;re working with
          </TextReveal>

          <div
            ref={dividerRef}
            className="h-[1px] w-12 bg-white/15 mb-10 origin-left"
          />

          <div
            ref={bodyRef}
            className="text-base md:text-lg text-gray-200 leading-relaxed space-y-6"
          >
            <p>
              I&apos;m Sarthak, an engineer based in New Delhi. I build
              production AI agent systems for US tech companies, focused on
              the unglamorous parts most AI consultants skip: permissions,
              audit trails, evals, and rollback. If you can&apos;t show your
              security team how an agent works, you can&apos;t ship it.
            </p>
            <p>
              For the last two years, I&apos;ve worked on AI training and
              agent systems via Turing, Ignitech, and G2i, on projects for
              OpenAI, Anthropic, Meta, and others. That work taught me what
              production-grade AI systems require beyond the demo. Now
              I&apos;m bringing that into agent builds for US tech companies
              that need real workflow automation without the data egress
              risk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
