"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/demo/donut-chart";
import { chipColors, dotColors } from "@/components/dashboard/colors";
import { quickCreate } from "@/lib/mock-data";
import {
  Presentation,
  ListChecks,
  Grid3x3,
  MousePointerClick,
  FileText,
  HelpCircle,
  Layers,
  Share2,
  Clock,
  type LucideIcon,
} from "lucide-react";

const qcIcons: Record<string, LucideIcon> = {
  presentation: Presentation,
  listChecks: ListChecks,
  grid: Grid3x3,
  mousePointer: MousePointerClick,
  fileText: FileText,
  helpCircle: HelpCircle,
  layers: Layers,
  share2: Share2,
};

type RecentMaterial = {
  id: string;
  kind: "presentation" | "quiz";
  topic: string;
  subject: string | null;
  createdAt: string;
};

type TeacherStats = {
  role: "teacher";
  groups: number;
  students: number;
  materials: number;
  assignments: number;
  avgScore: number;
  submissions: number;
  status: { submitted: number; pending: number };
  recentMaterials: RecentMaterial[];
};

// Cycle a stable colour per recent material so the accent bars vary.
const materialColors = ["violet", "blue", "amber", "emerald"] as const;

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function StatSkeleton() {
  return (
    <Card className="p-5">
      <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
    </Card>
  );
}

export default function TeacherDashboard() {
  const { d } = useI18n();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        // Only accept a well-formed teacher payload — guards against the
        // "undefined" cards that appeared when an error object slipped through.
        if (active && s && s.role === "teacher") setStats(s);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: d.sidebarTeacher.classes, value: stats?.groups ?? 0, color: "violet", icon: "users" },
    { label: d.stat.students, value: stats?.students ?? 0, color: "emerald", icon: "users" },
    { label: d.stat.assignments, value: stats?.assignments ?? 0, color: "blue", icon: "clipboard" },
    { label: d.stat.avgScore, value: `${stats?.avgScore ?? 0}%`, color: "amber", icon: "target" },
  ];

  const recent = stats?.recentMaterials ?? [];
  const submitted = stats?.status.submitted ?? 0;
  const pending = stats?.status.pending ?? 0;
  const statusTotal = submitted + pending;
  const donutData = [
    {
      label: d.status.submitted,
      value: statusTotal ? Math.round((submitted / statusTotal) * 100) : 0,
      count: submitted,
      color: "#7c5cff",
    },
    {
      label: d.status.notSubmitted,
      value: statusTotal ? Math.round((pending / statusTotal) * 100) : 0,
      count: pending,
      color: "#f43f5e",
    },
  ];

  return (
    <DashboardShell role="teacher">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{d.mainPanel}</h1>
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
        {/* Recent lessons */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{d.recentLessons}</h3>
            <Link href="/demo/materials" className="text-sm font-medium text-primary hover:underline">
              {d.viewAll}
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-slate-500">{d.empty.noMaterials}</p>
              <Link
                href="/demo/generate"
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                {d.quickCreate}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((l, i) => (
                <Link
                  key={l.id}
                  href={`/demo/view/${l.id}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-primary/40 dark:border-slate-700"
                >
                  <span
                    className={`h-9 w-1.5 rounded-full ${
                      dotColors[materialColors[i % materialColors.length]]
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{l.topic}</div>
                    <div className="text-xs text-slate-500">
                      {l.subject ? `${l.subject} · ` : ""}
                      {l.kind === "quiz" ? d.qc.quiz : d.qc.presentation}
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {timeOf(l.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Assignment status donut */}
        <Card>
          <h3 className="mb-4 font-semibold">{d.statusTitle}</h3>
          {loading ? (
            <div className="mx-auto h-[150px] w-[150px] animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
          ) : statusTotal === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">{d.empty.noSubmissions}</p>
          ) : (
            <DonutChart size={150} data={donutData} />
          )}
        </Card>
      </div>

      {/* Quick create */}
      <Card className="mt-6">
        <h3 className="mb-4 font-semibold">{d.quickCreate}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickCreate.map((q) => {
            const Icon = qcIcons[q.icon] ?? Presentation;
            return (
              <Link
                key={q.key}
                href="/demo/generate"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card dark:border-slate-700"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${chipColors[q.color]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{d.qc[q.key as keyof typeof d.qc]}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </DashboardShell>
  );
}
