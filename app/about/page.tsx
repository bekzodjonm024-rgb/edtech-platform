"use client";

import { useI18n } from "@/lib/i18n/context";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Roadmap } from "@/components/sections/roadmap";
import { CTA } from "@/components/sections/cta";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <SiteShell>
      <Container className="py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{t.nav.about}</h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
            {t.hero.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            { value: t.hero.stat1, label: t.hero.stat1Label },
            { value: t.hero.stat2, label: t.hero.stat2Label },
            { value: t.hero.stat3, label: t.hero.stat3Label },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            </Card>
          ))}
        </div>
      </Container>
      <Roadmap />
      <CTA />
    </SiteShell>
  );
}
