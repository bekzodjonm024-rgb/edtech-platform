"use client";

import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Reveal } from "./reveal";

export function Roadmap() {
  const { t } = useI18n();

  return (
    <section className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.roadmap.title}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t.roadmap.subtitle}</p>
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute left-4 top-2 h-full w-0.5 bg-slate-200 md:left-1/2 dark:bg-slate-800" />
          <div className="space-y-10">
            {t.roadmap.phases.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div
                  className={`relative flex items-start gap-6 md:w-1/2 ${
                    i % 2 === 0 ? "md:ml-auto md:pl-10" : "md:mr-auto md:flex-row-reverse md:pr-10 md:text-right"
                  }`}
                >
                  <span className="absolute left-4 top-1.5 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-primary bg-white md:left-0 dark:bg-slate-950" />
                  <div className="ml-10 md:ml-0">
                    <div className="text-sm font-semibold text-primary">{p.period}</div>
                    <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
