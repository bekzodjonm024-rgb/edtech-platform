"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/demo/donut-chart";
import { LineChart } from "@/components/demo/line-chart";
import { Lightbulb, BarChart3 } from "lucide-react";

type Analytics = {
  metrics: { total: number; avgScore: number; activeStudents: number; completionRate: number; expected: number };
  distribution: { key: string; value: number; count: number; color: string }[];
  timeline: { label: string; value: number }[];
  studentProgress: { name: string; submissions: number; avgScore: number; lastActive: string }[];
};

function StatSkeleton() {
  return (
    <Card className="p-5">
      <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </Card>
  );
}

export default function AnalyticsPage() {
  const { d, locale } = useI18n();
  const a = d.analytics;
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/analytics", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (active && j && j.metrics) setData(j);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const m = data?.metrics;
  const hasData = !!data && data.metrics.total > 0;

  const cards = [
    { label: a.avgScore, value: `${m?.avgScore ?? 0}%`, color: "violet", icon: "target" },
    { label: a.completion, value: `${m?.completionRate ?? 0}%`, color: "emerald", icon: "checkCircle" },
    { label: a.active, value: `${m?.activeStudents ?? 0}`, color: "blue", icon: "users" },
    { label: a.submissions, value: `${m?.total ?? 0}`, color: "amber", icon: "clipboard" },
  ];

  // Rule-based insights, localised inline.
  const insights: string[] = [];
  if (hasData && m) {
    const poor = data!.distribution.find((x) => x.key === "poor")?.count ?? 0;
    const excellent = data!.distribution.find((x) => x.key === "excellent")?.count ?? 0;
    const notSubmitted = Math.max(m.expected - m.total, 0);
    const T = {
      avg: {
        uz: `Guruh o'rtacha bahosi — ${m.avgScore}%.`,
        en: `Group average score is ${m.avgScore}%.`,
        ru: `Средний балл группы — ${m.avgScore}%.`,
      }[locale],
      poor: {
        uz: `${poor} ta natija 50% dan past — bu talabalarga qo'shimcha yordam bering.`,
        en: `${poor} results are below 50% — give those students extra support.`,
        ru: `${poor} результатов ниже 50% — окажите этим студентам помощь.`,
      }[locale],
      excellent: {
        uz: `${excellent} ta natija a'lo darajada (90%+) — zo'r ish!`,
        en: `${excellent} results are excellent (90%+) — great work!`,
        ru: `${excellent} результатов на отлично (90%+) — отличная работа!`,
      }[locale],
      notSubmitted: {
        uz: `${notSubmitted} ta topshiriq hali topshirilmagan (topshirish ${m.completionRate}%).`,
        en: `${notSubmitted} submissions are still pending (completion ${m.completionRate}%).`,
        ru: `${notSubmitted} сдач ещё не получено (доля сдач ${m.completionRate}%).`,
      }[locale],
    };
    insights.push(T.avg);
    if (notSubmitted > 0) insights.push(T.notSubmitted);
    if (poor > 0) insights.push(T.poor);
    if (excellent > 0) insights.push(T.excellent);
  }

  return (
    <DashboardShell role="teacher">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <BarChart3 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">{a.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{a.subtitle}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : cards.map((c) => (
              <StatCard key={c.label} label={c.label} value={c.value} color={c.color} icon={c.icon} />
            ))}
      </div>

      {!loading && !hasData ? (
        <Card className="mt-6 py-12 text-center text-sm text-slate-500">{a.noData}</Card>
      ) : (
        <>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Distribution */}
            <Card>
              <h3 className="mb-4 font-semibold">{a.distribution}</h3>
              {loading ? (
                <div className="mx-auto h-[150px] w-[150px] animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
              ) : (
                <DonutChart
                  size={150}
                  data={data!.distribution.map((x) => ({
                    label: d.dist[x.key as keyof typeof d.dist],
                    value: x.value,
                    count: x.count,
                    color: x.color,
                  }))}
                />
              )}
            </Card>

            {/* Timeline */}
            <Card>
              <h3 className="mb-4 font-semibold">{a.timeline}</h3>
              {loading ? (
                <div className="h-[200px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ) : data!.timeline.length >= 2 ? (
                <LineChart data={data!.timeline} />
              ) : (
                <p className="py-16 text-center text-sm text-slate-400">{a.noData}</p>
              )}
            </Card>
          </div>

          {/* Student progress */}
          <Card className="mt-6">
            <h3 className="mb-4 font-semibold">{a.students}</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs text-slate-400 dark:border-slate-700">
                      <th className="pb-2 font-medium">{a.thStudent}</th>
                      <th className="pb-2 text-center font-medium">{a.thSubs}</th>
                      <th className="pb-2 text-center font-medium">{a.thAvg}</th>
                      <th className="pb-2 text-right font-medium">{a.thLast}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.studentProgress.map((s, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                        <td className="py-2.5 font-medium">{s.name}</td>
                        <td className="py-2.5 text-center text-slate-500">{s.submissions}</td>
                        <td className="py-2.5 text-center">
                          <span
                            className={`font-semibold ${
                              s.avgScore >= 70
                                ? "text-emerald-500"
                                : s.avgScore >= 50
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            {s.avgScore}%
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-xs text-slate-400">
                          {new Date(s.lastActive).toLocaleDateString([], { day: "numeric", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Insights */}
          {!loading && insights.length > 0 && (
            <Card className="mt-6 border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-900/10">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4 text-blue-500" /> {a.insights}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {insights.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-blue-500">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
