"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Users, FolderOpen, BookOpen, ClipboardList, TrendingUp } from "lucide-react";

type Stats = {
  users: { total: number; teachers: number; students: number; admins: number };
  groups: number;
  materials: { total: number; presentations: number; quizzes: number; essays: number };
  submissions: number;
  recentUsers: { id: string; name: string; email: string; role: string; provider: string; createdAt: string }[];
  recentSubmissions: {
    id: string;
    score: number;
    updatedAt: string;
    student: { name: string; email: string };
    assignment: { material: { topic: string; kind: string } };
  }[];
};

const roleColor: Record<string, string> = {
  admin: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  teacher: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};
const kindColor: Record<string, string> = {
  quiz: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  essay: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  presentation: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Foydalanuvchilar" value={stats.users.total} color="text-violet-500"
          sub={`${stats.users.teachers} o'qituvchi · ${stats.users.students} talaba`} />
        <StatCard icon={FolderOpen} label="Guruhlar" value={stats.groups} color="text-sky-500" />
        <StatCard icon={BookOpen} label="Materiallar" value={stats.materials.total} color="text-amber-500"
          sub={`${stats.materials.quizzes} test · ${stats.materials.essays} uy vazifasi · ${stats.materials.presentations} taqdimot`} />
        <StatCard icon={ClipboardList} label="Topshiriqlar" value={stats.submissions} color="text-emerald-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent users */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" /> {"Oxirgi ro'yxatdan o'tganlar"}
          </h2>
          <div className="space-y-3">
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {u.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{u.name}</div>
                  <div className="truncate text-xs text-slate-500">{u.email}</div>
                </div>
                <span className={`shrink-0 rounded-pill px-2 py-0.5 text-xs font-medium ${roleColor[u.role] ?? ""}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent submissions */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <ClipboardList className="h-4 w-4 text-primary" /> Oxirgi natijalar
          </h2>
          <div className="space-y-3">
            {stats.recentSubmissions.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                  s.score >= 85 ? "bg-emerald-100 text-emerald-600" : s.score >= 60 ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                }`}>
                  {s.score}%
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.assignment.material.topic}</div>
                  <div className="truncate text-xs text-slate-500">{s.student.name}</div>
                </div>
                <span className={`shrink-0 rounded-pill px-2 py-0.5 text-xs font-medium ${kindColor[s.assignment.material.kind] ?? ""}`}>
                  {s.assignment.material.kind}
                </span>
              </div>
            ))}
            {stats.recentSubmissions.length === 0 && (
              <p className="text-sm text-slate-400">{"Hali natija yo'q"}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, color, sub,
}: {
  icon: React.ElementType; label: string; value: number; color: string; sub?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
