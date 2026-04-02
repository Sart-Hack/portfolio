"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import ReactMarkdown from "react-markdown";
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
  { type: "claude", text: "**Claude Code**" },
  { type: "blank", text: "" },
  { type: "claude", text: "That's it. That's the whole stack." },
];

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

// Markdown renderer styled like Claude Code terminal output
function ClaudeMarkdown({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        // Bold: white bold
        strong: ({ children }) => (
          <strong className="text-white font-bold">{children}</strong>
        ),
        // Italic: dim
        em: ({ children }) => (
          <em className="text-gray-400 italic">{children}</em>
        ),
        // Inline code: blue
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className="block my-1.5 text-[13px] text-blue-300 whitespace-pre-wrap">
                {children}
              </code>
            );
          }
          return <code className="text-blue-400">{children}</code>;
        },
        // Code blocks
        pre: ({ children }) => (
          <pre className="my-1 font-mono">{children}</pre>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="py-0.5 font-mono text-sm text-gray-200">{children}</p>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="py-0.5 font-mono text-sm text-gray-200 space-y-0.5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="py-0.5 font-mono text-sm text-gray-200 space-y-0.5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="font-mono text-sm text-gray-200">
            <span className="text-gray-500 mr-1">-</span>{children}
          </li>
        ),
        // Blockquote: dim italic
        blockquote: ({ children }) => (
          <blockquote className="text-gray-500 italic border-l-2 border-gray-700 pl-3 my-1">{children}</blockquote>
        ),
        // Headings
        h1: ({ children }) => (
          <p className="font-bold italic underline text-white py-0.5 font-mono text-sm">{children}</p>
        ),
        h2: ({ children }) => (
          <p className="font-bold text-white py-0.5 font-mono text-sm">{children}</p>
        ),
        h3: ({ children }) => (
          <p className="font-bold text-gray-300 py-0.5 font-mono text-sm">{children}</p>
        ),
        // Links: blue
        a: ({ children, href }) => (
          <a href={href} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{children}</a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
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
        <ClaudeMarkdown text={line.text} />
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
  // Streaming state: the currently streaming claude response text
  const [streamingText, setStreamingText] = useState<string | null>(null);
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
            setBannerVisible(true);
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

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleCount, streamingText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping || !initialDone) return;

    const userText = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    // Add user message + thinking
    const userLine: TermLine = { type: "user", text: userText };
    const blank: TermLine = { type: "blank", text: "" };
    const thinkingLine: TermLine = { type: "thinking", text: `${randomVerb()}...` };

    const preLines = [blank, userLine, blank, thinkingLine];
    const startFrom = lines.length;

    setLines((prev) => [...prev, ...preLines]);
    setVisibleCount(startFrom + preLines.length);

    chatHistory.current.push({ role: "user", text: userText });

    // Stream response
    let fullText = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatHistory.current,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("API error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Start streaming — show the claude role header by adding a blank claude line
      const streamStartIdx = startFrom + preLines.length;
      setLines((prev) => [...prev, { type: "blank", text: "" }]);
      setVisibleCount(streamStartIdx + 1);
      setStreamingText("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const sseLines = chunk.split("\n");

        for (const sseLine of sseLines) {
          if (!sseLine.startsWith("data: ")) continue;
          const data = sseLine.slice(6).trim();
          if (!data || data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setStreamingText(fullText);
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      fullText = fallbackResponses[fallbackIdx.current % fallbackResponses.length];
      fallbackIdx.current++;
    }

    // Finalize: replace streaming state with permanent line
    setStreamingText(null);
    chatHistory.current.push({ role: "model", text: fullText });

    const finalLine: TermLine = { type: "claude", text: fullText || "..." };
    setLines((prev) => {
      const updated = [...prev, finalLine];
      setVisibleCount(updated.length);
      return updated;
    });
    setIsTyping(false);
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

      // Hide thinking once response after it is visible
      if (line.type === "thinking") {
        const hasResponseAfter = lines
          .slice(i + 1, visibleCount)
          .some((l) => l.type === "claude");
        // Also hide if we're currently streaming (which means response started)
        if (hasResponseAfter || streamingText !== null) continue;
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

          {/* Banner */}
          <div className="px-5 pt-4 pb-2 border-b border-white/4">
            <AsciiBanner visible={bannerVisible} />
          </div>

          {/* Chat area */}
          <div ref={chatRef} className="px-5 py-3 max-h-[280px] overflow-y-auto">
            {renderLines()}

            {/* Streaming text — renders live as chunks arrive */}
            {streamingText !== null && (
              <div className="py-0.5">
                {/* Show Claude header if not already shown */}
                <div className="flex items-center gap-1.5 pt-2 pb-1">
                  <span className="text-[#D97757]">⏺</span>
                  <span className="font-mono text-xs font-semibold text-[#D97757]">Claude</span>
                </div>
                <ClaudeMarkdown text={streamingText} />
                <span className="inline-block w-1.5 h-4 bg-[#D97757] animate-blink" />
              </div>
            )}

            {/* Typing cursor during initial script */}
            {isTyping && streamingText === null && (
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
