"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart } from "@/components/demo/line-chart";
import { lessonStats, lessonAssignments, leaderboard, resultsDynamics } from "@/lib/mock-data";
import { Pencil, Share2, Plus, Clock } from "lucide-react";

export default function LessonDetailsPage() {
  const { d, s } = useI18n();
  const tabs = [s.lesson.tabs.main, s.lesson.tabs.assignments, s.lesson.tabs.students, s.lesson.tabs.reports, s.lesson.tabs.library];
  const [tab, setTab] = useState(0);

  return (
    <DashboardShell role="teacher" userName="Malika Ismoilova" userRole={d.teacherRole}>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{s.lesson.details}</div>
          <h1 className="mt-1 text-2xl font-bold">Fotosintezning molekulyar mexanizmi</h1>
          <div className="mt-1 text-sm text-slate-500">2-kurs · Molekulyar biologiya</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" /> {s.lesson.edit}
          </Button>
          <Link href="/demo/presentation">
            <Button size="sm">
              <Share2 className="h-4 w-4" /> {s.lesson.share}
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === i ? "bg-primary text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {lessonStats.map((st) => (
          <Card key={st.key} className="p-5">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {s.lesson.stat[st.key as keyof typeof s.lesson.stat]}
            </div>
            <div className="mt-2 text-3xl font-bold">{st.value}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Assignments */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-semibold">{s.lesson.tabs.assignments}</h3>
          <div className="space-y-2">
            {lessonAssignments.map((a) => {
              const pct = Math.round((a.submitted / a.total) * 100);
              return (
                <Link
                  key={a.title}
                  href="/demo/quiz"
                  className="flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-primary/40 dark:border-slate-700"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.type}</div>
                  </div>
                  <div className="hidden w-28 sm:block">
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>{a.submitted}/{a.total}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> {a.time}
                  </span>
                </Link>
              );
            })}
          </div>
          <Button className="mt-4 w-full" variant="outline">
            <Plus className="h-4 w-4" /> {s.lesson.newAssignment}
          </Button>
        </Card>

        {/* Active students leaderboard */}
        <Card>
          <h3 className="mb-4 font-semibold">{s.lesson.activeStudents}</h3>
          <div className="space-y-3">
            {leaderboard.map((st, i) => (
              <div key={st.name} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">{i + 1}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {st.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{st.name}</span>
                <span className="text-sm font-semibold text-emerald-500">{st.score}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dynamics */}
      <Card className="mt-6">
        <h3 className="mb-4 font-semibold">{s.lesson.dynamics}</h3>
        <LineChart data={resultsDynamics} />
      </Card>
    </DashboardShell>
  );
}
