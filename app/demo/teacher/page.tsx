"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/demo/donut-chart";
import { chipColors, dotColors } from "@/components/dashboard/colors";
import {
  teacherStats,
  recentLessons,
  assignmentStatus,
  quickCreate,
} from "@/lib/mock-data";
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

type TeacherStats = {
  groups: number;
  students: number;
  materials: number;
  assignments: number;
  avgScore: number;
};

export default function TeacherDashboard() {
  const { d } = useI18n();
  const [stats, setStats] = useState<TeacherStats | null>(null);

  useEffect(() => {
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((s) => setStats(s))
      .catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: d.sidebarTeacher.classes, value: String(stats.groups), color: "violet", icon: "users" },
        { label: d.stat.students, value: String(stats.students), color: "emerald", icon: "users" },
        { label: d.stat.assignments, value: String(stats.assignments), color: "blue", icon: "clipboard" },
        { label: d.stat.avgScore, value: `${stats.avgScore}%`, color: "amber", icon: "target" },
      ]
    : teacherStats.map((s) => ({
        label: d.stat[s.key as keyof typeof d.stat],
        value: s.value,
        color: s.color,
        icon: s.icon,
      }));

  return (
    <DashboardShell role="teacher" userName="Malika Ismoilova" userRole={d.teacherRole}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{d.mainPanel}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{d.overview}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} icon={s.icon} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent lessons */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{d.recentLessons}</h3>
            <Link href="/demo/reports" className="text-sm font-medium text-primary hover:underline">
              {d.viewAll}
            </Link>
          </div>
          <div className="space-y-2">
            {recentLessons.map((l) => (
              <Link
                key={l.title}
                href="/demo/lesson"
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-primary/40 dark:border-slate-700"
              >
                <span className={`h-9 w-1.5 rounded-full ${dotColors[l.color]}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{l.title}</div>
                  <div className="text-xs text-slate-500">{l.meta}</div>
                </div>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {l.time}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Assignment status donut */}
        <Card>
          <h3 className="mb-4 font-semibold">{d.statusTitle}</h3>
          <DonutChart
            size={150}
            data={assignmentStatus.map((s) => ({
              label: d.status[s.key as keyof typeof d.status],
              value: s.value,
              count: s.count,
              color: s.color,
            }))}
          />
        </Card>
      </div>

      {/* Quick create */}
      <Card className="mt-6">
        <h3 className="mb-4 font-semibold">{d.quickCreate}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickCreate.map((q) => {
            const Icon = qcIcons[q.icon] ?? Presentation;
            const href = q.key === "presentation" ? "/demo/generate" : "/demo/generate";
            return (
              <Link
                key={q.key}
                href={href}
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
