"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";

interface TermLine {
  type: "user" | "claude" | "thinking" | "blank";
  text: string;
}

const thinkingVerbs = [
  "Pondering", "Analyzing", "Clauding", "Cogitating",
  "Contemplating", "Brewing", "Computing", "Crystallizing",
];

function randomVerb() {
  return thinkingVerbs[Math.floor(Math.random() * thinkingVerbs.length)];
}

const initialScript: TermLine[] = [
  { type: "user", text: "what's your tech stack?" },
  { type: "blank", text: "" },
  { type: "thinking", text: `${randomVerb()}...` },
  { type: "blank", text: "" },
  { type: "claude", text: "Analyzing workspace..." },
  { type: "claude", text: "Scanning dependencies..." },
  { type: "claude", text: "Reading package.json..." },
  { type: "blank", text: "" },
  { type: "claude", text: "Tech stack identified:" },
  { type: "blank", text: "" },
  { type: "claude", text: "Claude Code" },
  { type: "blank", text: "" },
  { type: "claude", text: "That's it. That's the whole stack." },
];

// Fallback if API fails
const fallbackResponses = [
  "I'm taking a break. Try again in a sec.",
  "Even Claude needs a moment sometimes.",
  "The API gremlins got me. One more try?",
];

const spinnerFrames = ["·", "✢", "✳", "✶", "✻", "✽"];

function Spinner() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setFrame((f) => (f + 1) % spinnerFrames.length), 120);
    return () => clearInterval(interval);
  }, []);
  return <span className="text-[#D97757]">{spinnerFrames[frame]}</span>;
}

function TerminalLine({ line, isLatestThinking }: { line: TermLine; isLatestThinking?: boolean }) {
  if (line.type === "blank") return <div className="h-2" />;

  if (line.type === "thinking") {
    return (
      <div className="flex items-center gap-2 py-0.5">
        {isLatestThinking ? <Spinner /> : <span className="text-[#D97757]">✽</span>}
        <span className="font-mono text-sm text-[#D97757]">{line.text}</span>
      </div>
    );
  }

  if (line.type === "claude") {
    return (
      <div className="py-0.5">
        <span className="font-mono text-sm text-gray-200">{line.text}</span>
      </div>
    );
  }

  return (
    <div className="py-0.5">
      <span className="font-mono text-sm text-[#7AB4E8]">{line.text}</span>
    </div>
  );
}

function RoleHeader({ type }: { type: "user" | "claude" }) {
  if (type === "claude") {
    return (
      <div className="flex items-center gap-1.5 pt-2 pb-1">
        <span className="text-[#D97757]">⏺</span>
        <span className="font-mono text-xs font-semibold text-[#D97757]">Claude</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 pt-2 pb-1">
      <span className="text-[#7AB4E8]">❯</span>
      <span className="font-mono text-xs font-semibold text-[#7AB4E8]">You</span>
    </div>
  );
}

function AsciiBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="mb-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/claude-banner.png"
        alt="Claude Code"
        className="max-w-[200px] h-auto max-h-[60px] object-contain object-left"
        draggable={false}
      />
      <div className="text-[11px] text-gray-600 font-mono mt-2">
        v2.1.90 &middot; model: opus-4-6
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [lines, setLines] = useState<TermLine[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [initialDone, setInitialDone] = useState(false);
  const chatHistory = useRef<{ role: string; text: string }[]>([]);
  const fallbackIdx = useRef(0);
  const hasTriggered = useRef(false);

  const typeOutLines = useCallback((newLines: TermLine[], startFrom: number) => {
    setIsTyping(true);
    let delay = 0;
    newLines.forEach((line, i) => {
      const extra =
        line.type === "thinking" ? 1800 :
        line.type === "user" ? 500 :
        line.type === "blank" ? 80 :
        150;
      delay += extra;
      setTimeout(() => {
        setVisibleCount(startFrom + i + 1);
        if (i === newLines.length - 1) setIsTyping(false);
      }, delay);
    });
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          onEnter: () => {
            if (hasTriggered.current) return;
            hasTriggered.current = true;

            // Show banner immediately
            setBannerVisible(true);

            // Start conversation after a pause
            setTimeout(() => {
              setLines(initialScript);
              typeOutLines(initialScript, 0);
            }, 800);

            setTimeout(() => setInitialDone(true), 800 + initialScript.length * 200 + 1200);
          },
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [typeOutLines]);

  // Auto-scroll only the chat area
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || !initialDone) return;

    const userText = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    // Add user message + thinking indicator
    const userLine: TermLine = { type: "user", text: userText };
    const blank: TermLine = { type: "blank", text: "" };
    const thinkingLine: TermLine = { type: "thinking", text: `${randomVerb()}...` };

    const preLines = [blank, userLine, blank, thinkingLine];
    const startFrom = lines.length;

    setLines((prev) => [...prev, ...preLines]);
    setVisibleCount(startFrom + preLines.length);

    // Track history for multi-turn
    chatHistory.current.push({ role: "user", text: userText });

    // Call API
    let responseText: string;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatHistory.current,
        }),
      });
      const data = await res.json();
      responseText = data.text || "...";
    } catch {
      responseText = fallbackResponses[fallbackIdx.current % fallbackResponses.length];
      fallbackIdx.current++;
    }

    chatHistory.current.push({ role: "model", text: responseText });

    // Split response into lines and type them out
    const responseLines: TermLine[] = [
      { type: "blank", text: "" },
      ...responseText.split("\n").filter(Boolean).map((t: string) => ({
        type: "claude" as const,
        text: t,
      })),
    ];

    const responseStart = startFrom + preLines.length;
    setLines((prev) => [...prev, ...responseLines]);

    // Type out response lines with delay
    let delay = 0;
    responseLines.forEach((line, i) => {
      const extra = line.type === "blank" ? 80 : 150;
      delay += extra;
      setTimeout(() => {
        setVisibleCount(responseStart + i + 1);
        if (i === responseLines.length - 1) setIsTyping(false);
      }, delay);
    });
  };

  const renderLines = () => {
    const result: React.ReactNode[] = [];
    let lastRole: string | null = null;

    for (let i = 0; i < visibleCount && i < lines.length; i++) {
      const line = lines[i];
      if (line.type === "blank") {
        result.push(<div key={`blank-${i}`} className="h-1.5" />);
        continue;
      }

      // Hide thinking lines once a claude response after them is visible
      if (line.type === "thinking") {
        const hasResponseAfter = lines
          .slice(i + 1, visibleCount)
          .some((l) => l.type === "claude");
        if (hasResponseAfter) continue; // response loaded — hide the thinking text
      }

      const role = line.type === "user" ? "user" : "claude";
      if (role !== lastRole) {
        result.push(<RoleHeader key={`header-${i}`} type={role as "user" | "claude"} />);
        lastRole = role;
      }

      const isLatestThinking = line.type === "thinking";

      result.push(
        <TerminalLine key={`line-${i}`} line={line} isLatestThinking={isLatestThinking} />
      );
    }

    return result;
  };

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-16">
      <div className="relative max-w-3xl mx-auto w-full">
        <TextReveal as="h2" className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-4" splitType="words">
          Tech Stack
        </TextReveal>
        <div className="h-[1px] w-12 bg-white/15 mb-12 origin-left" />

        {/* Terminal */}
        <div className="rounded-xl border border-white/10 bg-[#0d0d14] overflow-hidden shadow-2xl shadow-black/40">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/6 bg-[#111118]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 text-[11px] text-gray-600 font-mono">~/portfolio</span>
          </div>

          {/* Banner area — always visible, never scrolls away */}
          <div className="px-5 pt-4 pb-2 border-b border-white/4">
            <AsciiBanner visible={bannerVisible} />
          </div>

          {/* Chat area — scrollable independently */}
          <div ref={chatRef} className="px-5 py-3 max-h-[280px] overflow-y-auto">
            {renderLines()}

            {isTyping && (
              <div className="py-0.5">
                <span className="inline-block w-1.5 h-4 bg-[#D97757] animate-blink" />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="mx-4 mb-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[#888888]/40 bg-[#0a0a12] focus-within:border-[#888888]/70 transition-colors"
            >
              <span className="text-[#7AB4E8] font-mono text-sm">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={initialDone && !isTyping ? "Ask me anything..." : ""}
                disabled={!initialDone || isTyping}
                className="flex-1 bg-transparent font-mono text-sm text-gray-200 placeholder:text-gray-700 outline-none disabled:opacity-30"
                data-hover
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || !initialDone}
                className="text-gray-600 hover:text-[#D97757] transition-colors disabled:opacity-20"
                data-hover
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-4 font-mono">
          try typing something ^
        </p>
      </div>
    </section>
  );
}
