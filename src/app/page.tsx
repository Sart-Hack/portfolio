import SmoothScroll from "@/components/SmoothScroll";
import SceneLoader from "@/components/SceneLoader";
import CustomCursor from "@/components/ui/CustomCursor";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <SceneLoader />
      <div id="scroll-container" className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Contact />
      </div>
    </SmoothScroll>
  );
}
