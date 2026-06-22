"use client";

import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { AlertCircle, GraduationCap, Users } from "lucide-react";

export function Problems() {
  const { t } = useI18n();

  const columns = [
    { icon: GraduationCap, title: t.problems.teachers, items: t.problems.teacherItems },
    { icon: Users, title: t.problems.students, items: t.problems.studentItems },
  ];

  return (
    <section className="py-20">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.problems.title}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {t.problems.subtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {columns.map((col, i) => (
            <Reveal key={col.title} delay={i * 0.1}>
              <Card className="h-full">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <col.icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-semibold">{col.title}</h3>
                </div>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span>{item}</span>
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
