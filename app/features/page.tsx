import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Vision } from "@/components/sections/vision";
import { CTA } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Imkoniyatlar",
  description:
    "EduAI OS imkoniyatlari: AI ma'ruza va taqdimot generatori, test va insho tuzish, " +
    "AI repetitor, guruhlar, vazifalar va o'qituvchi tahlili.",
  alternates: { canonical: "/features" },
};

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
