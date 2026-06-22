"use client";

import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";
import {
  Presentation,
  ListChecks,
  ClipboardList,
  BarChart3,
  Languages,
  Bot,
} from "lucide-react";

const icons = [Presentation, ListChecks, ClipboardList, BarChart3, Languages, Bot];

export function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.features.title}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t.features.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08}>
                <Card className="group h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
