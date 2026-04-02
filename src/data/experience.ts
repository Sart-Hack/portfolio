export interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  type: string;
  accent: "amber" | "orange" | "gold";
}

export const experiences: Experience[] = [
  {
    title: "AI Innovation Specialist",
    company: "Khoros",
    period: "Jul 2025 - Present",
    location: "Texas, US",
    type: "Remote",
    accent: "amber",
  },
  {
    title: "Consultant",
    company: "Voriq AI",
    period: "May 2025 - Present",
    location: "New Delhi",
    type: "On-site",
    accent: "orange",
  },
  {
    title: "AI Innovation Specialist",
    company: "IgniteTech",
    period: "Jun 2024 - Present",
    location: "United States",
    type: "Remote",
    accent: "amber",
  },
  {
    title: "Full-stack Developer",
    company: "Turing",
    period: "Mar 2024 - Jun 2024",
    location: "Remote",
    type: "Remote",
    accent: "gold",
  },
  {
    title: "Co-Founder",
    company: "The Hyper Brand",
    period: "Nov 2023 - Mar 2024",
    location: "New Delhi",
    type: "On-site",
    accent: "orange",
  },
];
