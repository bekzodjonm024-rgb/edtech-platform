"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/demo/progress-ring";
import { studentStats, studentAssignments, studentAchievements } from "@/lib/mock-data";
import { CalendarClock } from "lucide-react";

export default function StudentDashboard() {
  const { d } = useI18n();
  const { user } = useAuth();
  const [submitted] = useState<number[]>([]);
  const firstName = user?.name?.split(" ")[0] ?? "";

  const overall = Math.round(
    studentAssignments.reduce(
      (s, a) => s + (submitted.includes(a.id) ? 100 : a.progress),
      0
    ) / studentAssignments.length
  );

  return (
    <DashboardShell role="student" userName="Ali Valiyev" userRole={d.studentRole}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{d.welcome}, {firstName}! 👋</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{d.overview}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {studentStats.map((s) => (
          <StatCard
            key={s.key}
            label={d.stat[s.key as keyof typeof d.stat]}
            value={s.value}
            color={s.color}
            icon={s.icon}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Assignments */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-semibold">{d.sidebarStudent.assignments}</h3>
          <div className="space-y-3">
            {studentAssignments.map((a) => {
              const isDone = a.done || submitted.includes(a.id);
              return (
                <div key={a.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <CalendarClock className="h-3 w-3" />
                        {a.due} · {a.subject}
                      </div>
                    </div>
                    {isDone ? (
                      <span className="shrink-0 text-xs font-semibold text-emerald-500">✓</span>
                    ) : (
                      <Link href="/demo/quiz">
                        <Button size="sm" variant="outline">→</Button>
                      </Link>
                    )}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${isDone ? 100 : a.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Overall progress + achievements */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center">
            <h3 className="mb-4 self-start font-semibold">{d.reports.avgScore}</h3>
            <ProgressRing value={overall} size={130} />
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">{d.achievements}</h3>
            <div className="space-y-3">
              {studentAchievements.map((a) => (
                <div
                  key={a.titleKey}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {d.ach[a.titleKey as keyof typeof d.ach]}
                    </div>
                    <div className="text-xs text-amber-500">
                      {a.points} {d.pointsWord}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
