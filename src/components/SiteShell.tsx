"use client";

import SmoothScroll from "@/components/SmoothScroll";
import SceneLoader from "@/components/SceneLoader";
import CustomCursor from "@/components/ui/CustomCursor";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      <SceneLoader />
      <main id="scroll-container" className="relative z-10">
        {children}
      </main>
    </SmoothScroll>
  );
}
