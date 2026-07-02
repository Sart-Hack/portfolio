import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Sarthak Gupta | Cybersecurity for AI agents, one layer up",
  description:
    "I install the security layer for AI agents: scoped access they can't exceed, human gates on destructive actions, and a replayable audit trail. For US tech companies past Series A.",
  openGraph: {
    title: "Sarthak Gupta | Cybersecurity for AI agents, one layer up",
    description:
      "The security layer for AI agents at US tech companies past Series A: scoped access, human gates on destructive actions, a full audit trail.",
    type: "website",
    url: "https://sarthak-gupta.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarthak Gupta | Cybersecurity for AI agents, one layer up",
    description:
      "The security layer for AI agents at US tech companies past Series A: scoped access, human gates on destructive actions, a full audit trail.",
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
        "Builds the security layer for AI agents at US tech companies past Series A. Focuses on scoped access, human approval gates, audit trails, evals, and rollback.",
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
        "The security layer for AI agents at US tech companies past Series A: scoped access, full audit trails, human approval gates on destructive actions.",
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
        name: "Agent Opportunity Audit",
        price: "3500",
        priceCurrency: "USD",
        description:
          "One-week workflow audit. Process map, three to five candidate workflows ranked by ROI and risk, tool permission matrix, data classification draft, recommended pilot scope with timeline and price, 30-minute readout call.",
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
      </body>
    </html>
  );
}
