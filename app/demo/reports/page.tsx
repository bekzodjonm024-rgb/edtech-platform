"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/demo/donut-chart";
import { LineChart } from "@/components/demo/line-chart";
import { reportsStats, reportsDistribution, resultsDynamics } from "@/lib/mock-data";

export default function ReportsPage() {
  const { d } = useI18n();
  const tabs = [d.reports.tabAll, d.reports.tabLessons, d.reports.tabStudents];
  const [tab, setTab] = useState(0);

  const statLabel: Record<string, string> = {
    avgScore: d.reports.avgScore,
    completedRate: d.reports.completedRate,
    activeStudents: d.reports.activeStudents,
    avgTime: d.reports.avgTime,
  };

  return (
    <DashboardShell role="teacher" userName="Malika Ismoilova" userRole={d.teacherRole}>
      <h1 className="mb-1 text-2xl font-bold">{d.reports.title}</h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">{d.overview}</p>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === i
                ? "bg-primary text-white"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {reportsStats.map((s) => {
          const positive = s.delta.startsWith("+");
          return (
            <Card key={s.key} className="p-5">
              <div className="text-sm text-slate-500 dark:text-slate-400">{statLabel[s.key]}</div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold">{s.value}</span>
                <span
                  className={`mb-1 text-xs font-semibold ${
                    positive ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {s.delta}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">{d.reports.distribution}</h3>
          <DonutChart
            size={170}
            data={reportsDistribution.map((r) => ({
              label: d.dist[r.key as keyof typeof d.dist],
              value: r.value,
              count: r.count,
              color: r.color,
            }))}
          />
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold">{d.reports.dynamics}</h3>
          <LineChart data={resultsDynamics} />
        </Card>
      </div>
    </DashboardShell>
  );
}
