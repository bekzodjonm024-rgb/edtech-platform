"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/demo/donut-chart";
import { LineChart } from "@/components/demo/line-chart";

type Report = {
  total: number;
  avgScore: number;
  activeStudents: number;
  completionRate: number;
  distribution: { key: string; value: number; count: number; color: string }[];
  recent: { label: string; value: number }[];
};

export default function ReportsPage() {
  const { d, locale } = useI18n();
  const tabs = [d.reports.tabAll, d.reports.tabLessons, d.reports.tabStudents];
  const [tab, setTab] = useState(0);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch("/api/reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setReport(data))
      .catch(() => setReport(null));
  }, []);

  const submittedLabel = { uz: "Topshirilgan", en: "Submitted", ru: "Сдано" }[locale];
  const noDataHint = {
    uz: "Hali natija yo'q. Talabalar testlarni yechgach, statistika shu yerda chiqadi.",
    en: "No results yet. Once students take quizzes, stats will appear here.",
    ru: "Результатов пока нет. Когда студенты пройдут тесты, статистика появится здесь.",
  }[locale];

  const cards = report
    ? [
        { label: d.reports.avgScore, value: `${report.avgScore}%` },
        { label: d.reports.completedRate, value: `${report.completionRate}%` },
        { label: d.reports.activeStudents, value: `${report.activeStudents}` },
        { label: submittedLabel, value: `${report.total}` },
      ]
    : [];

  const noData = report !== null && report.total === 0;

  return (
    <DashboardShell role="teacher">
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
        {cards.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </Card>
        ))}
        {report === null &&
          [0, 1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </Card>
          ))}
      </div>

      {noData ? (
        <Card className="mt-6 py-16 text-center text-slate-500 dark:text-slate-400">
          {noDataHint}
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 font-semibold">{d.reports.distribution}</h3>
            {report && (
              <DonutChart
                size={170}
                data={report.distribution.map((r) => ({
                  label: d.dist[r.key as keyof typeof d.dist],
                  value: r.value,
                  count: r.count,
                  color: r.color,
                }))}
              />
            )}
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">{d.reports.dynamics}</h3>
            {report && report.recent.length > 0 && <LineChart data={report.recent} />}
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
