"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/demo/progress-ring";
import { CalendarClock } from "lucide-react";

type EarnedAchievement = { key: "explorer" | "taskMaster" | "topStudent"; points: number };

type StudentAssignment = {
  id: string;
  topic: string;
  subject: string;
  kind: "presentation" | "quiz" | "essay";
  dueAt: string | null;
  done: boolean;
  score: number | null;
  progress: number;
};

type StudentStats = {
  role: "student";
  groups: number;
  assigned: number;
  completed: number;
  avgScore: number;
  points: number;
  achievements: EarnedAchievement[];
};

const achEmoji: Record<EarnedAchievement["key"], string> = {
  explorer: "🔎",
  taskMaster: "🏅",
  topStudent: "🌟",
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

export default function StudentDashboard() {
  const { d } = useI18n();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "";

  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<StudentAssignment[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((s) => {
          if (active && s && s.role === "student") setStats(s);
        }),
      fetch("/api/my/assignments", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (active && j && Array.isArray(j.assignments)) setAssignments(j.assignments);
        }),
    ])
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const dueLabel = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString([], { day: "numeric", month: "short" }) : "—";

  const cards = [
    { label: d.stat.assignments, value: stats?.assigned ?? 0, color: "violet", icon: "clipboard" },
    { label: d.stat.completed, value: stats?.completed ?? 0, color: "emerald", icon: "checkCircle" },
    { label: d.stat.avgScore, value: `${stats?.avgScore ?? 0}%`, color: "blue", icon: "target" },
    { label: d.stat.points, value: stats?.points ?? 0, color: "amber", icon: "trophy" },
  ];

  const overall = stats?.avgScore ?? 0;
  const achievements = stats?.achievements ?? [];

  return (
    <DashboardShell role="student">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{d.welcome}, {firstName}! 👋</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{d.overview}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : cards.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={String(s.value)}
                color={s.color}
                icon={s.icon}
              />
            ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Assignments */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-semibold">{d.sidebarStudent.assignments}</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          ) : !assignments || assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-slate-500">{d.empty.noSubmissions}</p>
              <Link
                href="/demo/groups"
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                {d.sidebarStudent.lessons}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{a.topic}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <CalendarClock className="h-3 w-3" />
                        {dueLabel(a.dueAt)} · {a.subject}
                      </div>
                    </div>
                    {a.done ? (
                      a.kind === "essay" ? (
                        <Link
                          href={`/demo/essay/${a.id}`}
                          className="shrink-0 text-xs font-semibold text-emerald-500 hover:underline"
                        >
                          {a.score != null ? `${a.score}%` : "✓"}
                        </Link>
                      ) : (
                        <span className="shrink-0 text-xs font-semibold text-emerald-500">
                          {a.score != null ? `${a.score}%` : "✓"}
                        </span>
                      )
                    ) : (
                      <Link
                        href={
                          a.kind === "quiz"
                            ? `/demo/quiz/${a.id}`
                            : a.kind === "essay"
                            ? `/demo/essay/${a.id}`
                            : `/demo/view/${a.id}`
                        }
                      >
                        <Button size="sm" variant="outline">→</Button>
                      </Link>
                    )}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Overall progress + achievements */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center">
            <h3 className="mb-4 self-start font-semibold">{d.reports.avgScore}</h3>
            {loading ? (
              <div className="h-[130px] w-[130px] animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
            ) : (
              <ProgressRing value={overall} size={130} />
            )}
          </Card>

          <Card>
            <h3 className="mb-4 font-semibold">{d.achievements}</h3>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : achievements.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-500">{d.empty.noSubmissions}</p>
            ) : (
              <div className="space-y-3">
                {achievements.map((a) => (
                  <div
                    key={a.key}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <span className="text-2xl">{achEmoji[a.key]}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{d.ach[a.key]}</div>
                      <div className="text-xs text-amber-500">
                        {a.points} {d.pointsWord}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
