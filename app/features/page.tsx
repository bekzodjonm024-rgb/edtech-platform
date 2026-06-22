import { SiteShell } from "@/components/layout/site-shell";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Vision } from "@/components/sections/vision";
import { CTA } from "@/components/sections/cta";

export default function FeaturesPage() {
  return (
    <SiteShell>
      <div className="pt-10">
        <Features />
      </div>
      <Vision />
      <HowItWorks />
      <CTA />
    </SiteShell>
  );
}
