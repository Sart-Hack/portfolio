"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const wontDo = [
  "Delete or permanently destroy data, files, repos, tickets, records, or accounts",
  "Send customer-facing messages (email, chat, SMS, support reply) without human approval",
  "Execute financial transactions (payments, refunds, transfers, contract signing)",
  "Write to production systems without scoped permissions and a rollback plan",
  "Access secrets or credentials except through approved vault patterns (1Password, Doppler, AWS Secrets Manager)",
  "Bypass existing approval workflows that humans rely on",
  "Take irreversible actions without a human-in-the-loop gate",
  "Use customer PII outside the boundaries set by your data classification",
];

const alwaysHas = [
  "A documented permission matrix (who can do what)",
  "Scoped, least-privilege credentials for every tool it can reach",
  "Audit logs for every tool call (exportable, queryable)",
  "Human-approval gates on customer-facing or high-blast-radius actions",
  "Eval suite for known failure modes",
  "Rollback or undo plan for any state-changing operation",
  "A kill switch to disable any tool without a redeploy",
  "Failure-mode visibility (agent refuses unsafe requests and says why)",
];

export default function WillNotAutomate() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }

      [leftRef.current, rightRef.current].forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });

        const items = el.querySelectorAll("[data-wna-item]");
        if (items.length) {
          gsap.from(items, {
            x: -8,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            delay: 0.25 + i * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-6 md:px-16">
      <div className="relative max-w-5xl mx-auto">
        <h2
          ref={headingRef}
          className="flex items-baseline gap-3 text-xl md:text-3xl font-semibold tracking-tight text-white mb-10"
        >
          <span className="text-[#D97757] font-light leading-none">▎</span>
          <span>What every agent I build will and won&apos;t do.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            ref={leftRef}
            className="border border-white/10 rounded-xl bg-[#13131c] p-7"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-5 font-medium font-mono">
              Will not autonomously
            </div>
            <ul className="space-y-3">
              {wontDo.map((item) => (
                <li
                  key={item}
                  data-wna-item
                  className="flex items-start gap-3 text-sm md:text-[15px] text-gray-200 leading-relaxed"
                >
                  <span className="text-[#D97757] font-mono mt-1 select-none flex-none">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={rightRef}
            className="border border-white/10 rounded-xl bg-[#13131c] p-7"
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-5 font-medium font-mono">
              Every agent always has
            </div>
            <ul className="space-y-3">
              {alwaysHas.map((item) => (
                <li
                  key={item}
                  data-wna-item
                  className="flex items-start gap-3 text-sm md:text-[15px] text-gray-200 leading-relaxed"
                >
                  <span className="text-[#28c840] font-mono mt-1 select-none flex-none">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
