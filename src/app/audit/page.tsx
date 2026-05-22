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
  title: "AI Agent Audit | One week, $3,500 | Sarthak Gupta",
  description:
    "Production AI agent readiness audit for US tech companies past Series A. I map your highest-friction workflow, surface three to five automation candidates, and write a deployment plan with risk and ROI estimates. One week, $3,500.",
  alternates: {
    canonical: "https://sarthak-gupta.com/audit",
  },
  openGraph: {
    title: "AI Agent Audit | One week, $3,500 | Sarthak Gupta",
    description:
      "Production AI agent readiness audit for US tech companies past Series A. I map your highest-friction workflow and write a deployment plan with risk and ROI.",
    type: "website",
    url: "https://sarthak-gupta.com/audit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Audit | One week, $3,500 | Sarthak Gupta",
    description:
      "Production AI agent readiness audit for US tech companies past Series A. I map your highest-friction workflow and write a deployment plan with risk and ROI.",
  },
};

export default function AuditPage() {
  return (
    <SiteShell>
      <Hero
        headline="Agent Opportunity Audit."
        subhead="One week. $3,500. I map your highest-friction workflow and tell you which agents are worth building."
        body="For US tech companies past Series A. Not a generic AI readiness review. A scoped technical audit by the engineer who would build the system."
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
