"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { DEMO_URL } from "@/lib/config";

type Line =
  | { kind: "prompt"; text: string }
  | { kind: "row"; cols: [string, string, string] }
  | { kind: "text"; text: string }
  | { kind: "status"; text: string }
  | { kind: "blank" };

const SCRIPT: Line[] = [
  { kind: "prompt", text: "describe-stack" },
  { kind: "blank" },
  { kind: "row", cols: ["LLM gateway", "LiteLLM", "egress: client VPC only"] },
  { kind: "row", cols: ["Orchestrator", "Mastra", "runs in client infra"] },
  { kind: "row", cols: ["Observability", "Langfuse", "self-hosted, client owns data"] },
  { kind: "row", cols: ["Tool layer", "custom MCP", "least-privilege scoped"] },
  { kind: "row", cols: ["Approval gates", "Slack + webhooks", ""] },
  { kind: "row", cols: ["Audit sink", "client S3 / GCS", ""] },
  { kind: "row", cols: ["Eval suite", "Langfuse + custom", "correctness, PII, regression"] },
  { kind: "row", cols: ["Handover", "runbook + repo", "client owns everything"] },
  { kind: "blank" },
  { kind: "prompt", text: "describe-boundary" },
  { kind: "blank" },
  { kind: "text", text: "All components run inside client infrastructure." },
  { kind: "text", text: "No data leaves the boundary except via the LLM gateway." },
  { kind: "text", text: "Gateway logs every outbound call." },
  { kind: "text", text: "Every tool call is scoped, logged, and reversible." },
  { kind: "blank" },
  { kind: "prompt", text: "status" },
  { kind: "status", text: "ready." },
];

function PromptLine({ text }: { text: string }) {
  return (
    <div className="font-mono text-sm leading-6">
      <span className="text-[#7AB4E8]">$</span>{" "}
      <span className="text-white">{text}</span>
    </div>
  );
}

function RowLine({ cols }: { cols: [string, string, string] }) {
  return (
    <div className="font-mono text-[13px] leading-6 grid grid-cols-[140px_140px_320px] md:grid-cols-[180px_180px_1fr] gap-x-3 md:gap-x-4 pl-4 min-w-max md:min-w-0">
      <span className="text-gray-200">{cols[0]}</span>
      <span className="text-[#7AB4E8]">{cols[1]}</span>
      <span className="text-gray-400">{cols[2]}</span>
    </div>
  );
}

function TextLine({ text }: { text: string }) {
  return (
    <div className="font-mono text-[13px] leading-6 text-gray-200 pl-4">
      {text}
    </div>
  );
}

function StatusLine({ text }: { text: string }) {
  return (
    <div className="font-mono text-[13px] leading-6 pl-4">
      <span className="text-[#28c840]">{text}</span>
    </div>
  );
}

export default function Architecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !linesRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (terminalRef.current) {
        gsap.from(terminalRef.current, {
          y: 30,
          opacity: 0,
          scale: 0.98,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: terminalRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }

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

      const lineEls = linesRef.current?.querySelectorAll("[data-arch-line]");
      if (lineEls && lineEls.length) {
        gsap.from(lineEls, {
          opacity: 0,
          y: 4,
          duration: 0.32,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: terminalRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      if (captionRef.current) {
        gsap.from(captionRef.current, {
          opacity: 0,
          y: 8,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: captionRef.current,
            start: "top 95%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-20 pb-32 px-6 md:px-16">
      <div className="relative max-w-3xl mx-auto w-full">
        <h2
          ref={headingRef}
          className="flex items-baseline gap-3 text-xl md:text-3xl font-semibold tracking-tight text-white mb-10"
        >
          <span className="text-[#D97757] font-light leading-none">▎</span>
          <span>How an agent fits inside your infrastructure</span>
        </h2>

        {/* Terminal */}
        <div
          ref={terminalRef}
          className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6 bg-[#111118]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 text-[11px] text-gray-500 font-mono">
              ~/agent-stack
            </span>
          </div>

          {/* Output */}
          <div ref={linesRef} className="px-5 py-5 overflow-x-auto">
            {SCRIPT.map((line, i) => {
              if (line.kind === "blank") {
                return (
                  <div
                    key={i}
                    data-arch-line
                    className="h-2.5"
                    aria-hidden="true"
                  />
                );
              }
              return (
                <div key={i} data-arch-line>
                  {line.kind === "prompt" && <PromptLine text={line.text} />}
                  {line.kind === "row" && <RowLine cols={line.cols} />}
                  {line.kind === "text" && <TextLine text={line.text} />}
                  {line.kind === "status" && <StatusLine text={line.text} />}
                </div>
              );
            })}
          </div>
        </div>

        <p
          ref={captionRef}
          className="mt-8 flex items-baseline gap-3 text-sm md:text-base text-gray-300"
        >
          <span className="text-[#D97757] font-light leading-none">▎</span>
          <span>Every outbound call is routed, logged, and governed by policy.</span>
        </p>

        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="
            relative z-20 pointer-events-auto
            mt-7 inline-flex items-center gap-2
            text-sm md:text-base text-[#7AB4E8]
            hover:text-white transition-colors
          "
          data-hover
        >
          See it running: the governed agent demo
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
      </div>
    </section>
  );
}
