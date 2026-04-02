"use client";

import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

export default function TypeWriter({
  text,
  speed = 60,
  delay = 800,
  className = "",
}: TypeWriterProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayedLength >= text.length) return;

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [started, text.length, speed, displayedLength]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      <span className="animate-blink text-green-400">|</span>
    </span>
  );
}
