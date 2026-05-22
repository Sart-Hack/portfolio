"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const items = [
  {
    q: "Why not just build this internally?",
    a: "You can. The question is what your team's time is worth. Building a production agent system end-to-end (MCP servers, permissions, audit logs, evals, observability, integration with your existing tools) usually takes a senior engineer six to ten weeks of focused work. They have to learn the agent stack while building it. I've already done that learning on systems for OpenAI, Anthropic, Meta, and other frontier labs. Hire me for four weeks to ship a hardened pilot, or burn eight weeks of your engineer's time. The math usually wins for hiring me on the first one. Then your team owns and extends it.",
  },
  {
    q: "Why not use n8n / Zapier / Make?",
    a: "Those are great for deterministic workflows. If X then Y. The minute you need actual reasoning (is this customer angry, is this PII, should this escalate) you've outgrown them. Most teams I work with already have n8n or Zapier. We use them as the orchestration layer underneath the agent. Complementary, not competitive.",
  },
  {
    q: "Why not use ChatGPT Enterprise / Claude Team?",
    a: "Those are chat tools. Great if you want your team to ask AI questions. They don't do work. They can't read your Linear board, update your Zendesk tickets, post to your Slack. Not without an engineer building MCP servers between them. That's the gap I fill. Turning chat into agents that take action with guardrails.",
  },
  {
    q: "Why not wait for our SaaS vendors to ship agents?",
    a: "Some will. Some won't. The ones who do will charge per seat and only work within their own product. If you want one agent that crosses tools (pulls from Zendesk, updates Linear, posts to Slack, checks HubSpot) no single vendor is going to ship that for you. That's where custom agents stay valuable indefinitely.",
  },
  {
    q: "What happens if you disappear?",
    a: "Three things. One, you own all the code, the infrastructure, and the runbook. It lives in your accounts, not mine. Two, every engagement includes a handover doc that lets an internal engineer maintain and extend the system without me. Three, the architecture I build is intentionally boring. Standard tools (Mastra, LiteLLM, Langfuse), standard patterns, no proprietary magic. If I disappeared tomorrow, your team could keep this running. That's a design constraint I impose on every project.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

      const rows = listRef.current?.querySelectorAll("[data-faq-row]");
      if (rows && rows.length) {
        gsap.from(rows, {
          y: 16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-16">
      <div className="relative max-w-3xl mx-auto">
        <h2
          ref={headingRef}
          className="flex items-baseline gap-3 text-xl md:text-3xl font-semibold tracking-tight text-white mb-10"
        >
          <span className="text-[#D97757] font-light leading-none">▎</span>
          <span>Common questions</span>
        </h2>

        <div
          ref={listRef}
          className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden divide-y divide-white/8"
        >
          {items.map((item) => (
            <details
              key={item.q}
              data-faq-row
              className="group"
            >
              <summary
                className="
                  list-none cursor-pointer
                  flex items-center gap-4
                  px-6 py-5
                  text-sm md:text-base font-medium text-gray-100
                  hover:bg-white/[0.03]
                  transition-colors
                  [&::-webkit-details-marker]:hidden
                "
                data-hover
              >
                <span className="text-[#7AB4E8] font-mono text-xs flex-none transition-transform duration-200 group-open:rotate-90">
                  ▸
                </span>
                <span className="flex-1">{item.q}</span>
              </summary>
              <div className="px-6 pb-6 pl-[3.25rem] text-sm md:text-[15px] text-gray-300 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
