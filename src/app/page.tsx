import SiteShell from "@/components/SiteShell";
import Hero from "@/components/sections/Hero";
import ProofBullets from "@/components/sections/ProofBullets";
import WillNotAutomate from "@/components/sections/WillNotAutomate";
import Architecture from "@/components/sections/Architecture";
import OfferCard from "@/components/sections/OfferCard";
import Credentials from "@/components/sections/Credentials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
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
