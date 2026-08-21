import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sarthak-gupta.com"),
  title: "Sarthak Gupta | Give AI agents real work, not unchecked power",
  description:
    "I build the control layer that decides what your AI agents are allowed to do in production, before they act. Policy-checked, human-gated, fully logged.",
  openGraph: {
    title: "Sarthak Gupta | Give AI agents real work, not unchecked power",
    description:
      "The control layer for AI agents at US tech companies past Series A: every action checked against policy before it runs, high-risk actions gated, all of it logged.",
    type: "website",
    url: "https://sarthak-gupta.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarthak Gupta | Give AI agents real work, not unchecked power",
    description:
      "The control layer for AI agents at US tech companies past Series A: every action checked against policy before it runs, high-risk actions gated, all of it logged.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://sarthak-gupta.com/#sarthak",
      name: "Sarthak Gupta",
      url: "https://sarthak-gupta.com",
      jobTitle: "AI Agent Engineer",
      description:
        "Builds the control layer for AI agents at US tech companies past Series A: pre-action policy checks, human approval gates, audit trails, evals, and rollback.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Delhi",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/Sart-Hack",
        "https://linkedin.com/in/sarthak124",
      ],
      knowsAbout: [
        "AI agents",
        "Model Context Protocol",
        "MCP servers",
        "LLM gateways",
        "Agent observability",
        "Eval suites",
        "Mastra",
        "LangGraph",
        "Bifrost",
        "Langfuse",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://sarthak-gupta.com/#service",
      name: "Sarthak Gupta, AI Agent Consulting",
      url: "https://sarthak-gupta.com",
      image: "https://sarthak-gupta.com/opengraph-image",
      provider: { "@id": "https://sarthak-gupta.com/#sarthak" },
      description:
        "The control layer for AI agents at US tech companies past Series A: every action checked against policy before it runs, high-risk actions gated, all of it logged.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "New Delhi",
        addressCountry: "IN",
      },
      areaServed: { "@type": "Country", name: "United States" },
      serviceType: "AI agent development",
      priceRange: "$3,500",
      offers: {
        "@type": "Offer",
        name: "Agent Readiness Audit",
        price: "3500",
        priceCurrency: "USD",
        description:
          "One-week agent readiness audit. Action and access map, blast-radius review, permission matrix and data-classification draft, prioritized governance gaps with a plan to close each one, 30-minute readout call.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased overflow-x-hidden`}
    >
      <body className="bg-[#0a0a0f] text-gray-200 font-sans overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
