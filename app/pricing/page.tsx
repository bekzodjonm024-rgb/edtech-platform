"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function PricingPage() {
  const { t, locale } = useI18n();

  const plans = [
    {
      name: { uz: "Boshlang'ich", en: "Starter", ru: "Старт" }[locale],
      price: "$0",
      period: { uz: "/oy", en: "/mo", ru: "/мес" }[locale],
      features: t.vision.studentPoints,
      featured: false,
    },
    {
      name: { uz: "Pro", en: "Pro", ru: "Pro" }[locale],
      price: "$9",
      period: { uz: "/oy", en: "/mo", ru: "/мес" }[locale],
      features: t.vision.teacherPoints,
      featured: true,
    },
    {
      name: { uz: "Universitet", en: "University", ru: "Вуз" }[locale],
      price: { uz: "Kelishilgan", en: "Custom", ru: "Договорная" }[locale],
      period: "",
      features: t.features.items.slice(0, 4).map((f) => f.title),
      featured: false,
    },
  ];

  return (
    <SiteShell>
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{t.nav.pricing}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{t.features.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <Card
              key={p.name}
              className={`flex flex-col ${
                p.featured ? "ring-2 ring-primary shadow-lift" : ""
              }`}
            >
              {p.featured && (
                <Badge className="mb-3 self-start">★ Popular</Badge>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="mb-1 text-sm text-slate-500">{p.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/demo/teacher" className="mt-6">
                <Button variant={p.featured ? "primary" : "outline"} className="w-full">
                  {t.cta.button}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </SiteShell>
  );
}
