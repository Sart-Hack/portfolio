"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

function detectCanRender3D() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    if (!(canvas.getContext("webgl2") || canvas.getContext("webgl"))) return false;
  } catch {
    return false;
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useCanRender3D() {
  // Lazy initializer runs once. SSR returns true; client returns real value.
  // Scene is dynamic ssr:false, so any client-server divergence here is invisible.
  const [canRender] = useState(detectCanRender3D);
  return canRender;
}

export default function SceneLoader() {
  const [loaded, setLoaded] = useState(false);
  const canRender3D = useCanRender3D();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!canRender3D) {
    return <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0f]" />;
  }

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-[#0a0a0f] flex flex-col items-center justify-center transition-opacity duration-700 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="text-sm text-gray-600 tracking-wide">Loading</div>
        <div className="mt-3 w-40 h-[1px] bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-white/30 rounded-full transition-all duration-[1500ms] ease-out" style={{ width: loaded ? "100%" : "60%" }} />
        </div>
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Scene />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/40 to-[#0a0a0f]/80 pointer-events-none" />
      </div>
    </>
  );
}
