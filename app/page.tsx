import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/sections/hero";
import { Problems } from "@/components/sections/problems";
import { Vision } from "@/components/sections/vision";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Roadmap } from "@/components/sections/roadmap";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <Problems />
      <Vision />
      <Features />
      <HowItWorks />
      <Roadmap />
      <CTA />
    </SiteShell>
  );
}
