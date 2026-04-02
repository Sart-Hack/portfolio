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
  title: "Sarthak Gupta | AI Innovation Specialist",
  description:
    "AI Innovation Specialist building enterprise AI products. Full-stack developer working across ML and production UIs.",
  openGraph: {
    title: "Sarthak Gupta | AI Innovation Specialist",
    description:
      "AI Innovation Specialist building enterprise AI products at IgniteTech, Khoros, and Voriq AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-[#0a0a0f] text-gray-200 font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
