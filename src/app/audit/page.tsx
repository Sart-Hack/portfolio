import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import Hero from "@/components/sections/Hero";
import ProofBullets from "@/components/sections/ProofBullets";
import WillNotAutomate from "@/components/sections/WillNotAutomate";
import Architecture from "@/components/sections/Architecture";
import OfferCard from "@/components/sections/OfferCard";
import Credentials from "@/components/sections/Credentials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Agent Readiness Audit | One week, $3,500 | Sarthak Gupta",
  description:
    "I pressure-test an agent you're building or already running: what it can touch, what could go wrong, and what must be true before your security team signs off. One week, $3,500.",
  alternates: {
    canonical: "https://sarthak-gupta.com/audit",
  },
  openGraph: {
    title: "Agent Readiness Audit | One week, $3,500 | Sarthak Gupta",
    description:
      "I pressure-test an agent you're building or already running: what it can touch, what could go wrong, and what must be true before your security team signs off. One week, $3,500.",
    type: "website",
    url: "https://sarthak-gupta.com/audit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Readiness Audit | One week, $3,500 | Sarthak Gupta",
    description:
      "I pressure-test an agent you're building or already running: what it can touch, what could go wrong, and what must be true before your security team signs off. One week, $3,500.",
  },
};

export default function AuditPage() {
  return (
    <SiteShell>
      <Hero
        headline="Agent Readiness Audit."
        subhead="One week. $3,500. I pressure-test an agent you're building and tell you what has to be true before it ships."
        body="For US tech companies past Series A. Not a generic AI readiness review. A scoped technical audit by the engineer who would build the system: what the agent can touch, what breaks if it acts wrong, and the gaps you need to close."
        ctaCaption="No prototype, no commitment. You leave with a plan you could hand to any engineer."
      />
      <ProofBullets />
      <WillNotAutomate />
      <Architecture />
      <OfferCard />
      <Credentials />
      <FAQ />
      <Contact />
    </SiteShell>
  );
}
