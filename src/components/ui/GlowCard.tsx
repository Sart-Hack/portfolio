"use client";

interface GlowCardProps {
  value: string;
  label: string;
  accent?: "primary" | "secondary" | "muted";
  children?: React.ReactNode;
}

const accentStyles = {
  primary: {
    border: "border-[#10a37f]/20 hover:border-[#10a37f]/50",
    text: "text-[#10a37f]",
  },
  secondary: {
    border: "border-gray-200 hover:border-gray-300",
    text: "text-[#171717]",
  },
  muted: {
    border: "border-gray-200 hover:border-gray-300",
    text: "text-[#6b7280]",
  },
};

export default function GlowCard({
  value,
  label,
  accent = "primary",
  children,
}: GlowCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={`
        border ${styles.border}
        bg-white/80 backdrop-blur-sm rounded-xl p-6
        transition-all duration-300
        hover:shadow-sm
      `}
    >
      {children ?? (
        <>
          <div className={`text-3xl md:text-4xl font-semibold tracking-tight ${styles.text}`}>
            {value}
          </div>
          <div className="text-sm text-[#6b7280] mt-2">{label}</div>
        </>
      )}
    </div>
  );
}
