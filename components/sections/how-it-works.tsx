"use client";

import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Reveal } from "./reveal";

export function HowItWorks() {
  const { t } = useI18n();

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.how.title}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t.how.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lift">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
