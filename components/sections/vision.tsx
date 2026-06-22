"use client";

import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { Check } from "lucide-react";

export function Vision() {
  const { t } = useI18n();

  const columns = [
    { title: t.vision.forTeachers, points: t.vision.teacherPoints, accent: "primary" },
    { title: t.vision.forStudents, points: t.vision.studentPoints, accent: "secondary" },
  ] as const;

  return (
    <section className="bg-slate-50 py-20 dark:bg-slate-900/40">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.vision.title}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{t.vision.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {columns.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.1}>
              <Card className="h-full">
                <h3 className="mb-5 text-xl font-semibold">{col.title}</h3>
                <ul className="space-y-4">
                  {col.points.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
                          col.accent === "primary" ? "bg-primary" : "bg-secondary"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="text-slate-700 dark:text-slate-200">{p}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
