"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import TextReveal from "@/components/ui/TextReveal";
import {
  BOOKING_URL,
  CONTACT_EMAIL,
  LINKEDIN_URL,
  GITHUB_URL,
} from "@/lib/config";

const socials = [
  {
    name: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: LINKEDIN_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: GITHUB_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !iconsRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const icons = Array.from(iconsRef.current.children) as HTMLElement[];

    const ctx = gsap.context(() => {
      gsap.from(icons, {
        y: 30,
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: iconsRef.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      }

      if (footerRef.current) {
        gsap.from(footerRef.current, {
          opacity: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 98%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    // Magnetic hover
    const listeners: (() => void)[] = [];
    icons.forEach((icon) => {
      const onMove = (e: MouseEvent) => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(icon, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(icon, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      };
      icon.addEventListener("mousemove", onMove);
      icon.addEventListener("mouseleave", onLeave);
      listeners.push(() => {
        icon.removeEventListener("mousemove", onMove);
        icon.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      ctx.revert();
      listeners.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
    >
      <div className="relative text-center max-w-3xl">
        <TextReveal
          as="h2"
          className="text-2xl md:text-4xl font-semibold tracking-tight text-white leading-[1.1]"
          splitType="words"
        >
          Map your highest-friction workflow.
        </TextReveal>

        <TextReveal
          as="p"
          className="mt-5 text-base md:text-lg text-gray-300 max-w-xl mx-auto"
          delay={0.3}
          splitType="lines"
        >
          One call. No pitch. You leave with a clearer picture of where agents
          will actually help.
        </TextReveal>

        <div
          ref={ctaRef}
          className="mt-12 flex flex-col items-center gap-4"
        >
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
          <p className="text-sm text-gray-400">
            Or reach me directly:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-gray-200 hover:text-white underline-offset-4 hover:underline"
              data-hover
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>

        <div ref={iconsRef} className="flex gap-4 mt-14 justify-center">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              aria-label={social.name}
              className="
                relative z-20 pointer-events-auto
                border border-white/15 rounded-full p-3.5
                text-gray-200 bg-white/5
                hover:bg-white hover:text-[#0a0a0f] hover:border-white
                transition-colors duration-200
                will-change-transform
              "
              data-hover
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <footer
        ref={footerRef}
        className="absolute bottom-8 text-center"
      >
        <p className="text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Sarthak Gupta
        </p>
      </footer>
    </section>
  );
}
