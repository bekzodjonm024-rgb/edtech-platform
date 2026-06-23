import { SiteShell } from "@/components/layout/site-shell";
import { Hero } from "@/components/sections/hero";
import { Problems } from "@/components/sections/problems";
import { Vision } from "@/components/sections/vision";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Roadmap } from "@/components/sections/roadmap";
import { CTA } from "@/components/sections/cta";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: ["uz", "en", "ru"],
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteShell>
        <Hero />
        <Problems />
        <Vision />
        <Features />
        <HowItWorks />
        <Roadmap />
        <CTA />
      </SiteShell>
    </>
  );
}
