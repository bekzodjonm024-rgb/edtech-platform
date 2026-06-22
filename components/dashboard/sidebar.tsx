"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { authStrings } from "@/lib/i18n/auth-strings";
import { groupStrings } from "@/lib/i18n/group-strings";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  ClipboardList,
  Users,
  Library,
  Bot,
  BarChart3,
  MessageSquare,
  Settings,
  ListChecks,
  Trophy,
  Sparkles,
  FolderArchive,
  TrendingUp,
} from "lucide-react";

export type Role = "teacher" | "student";

export function Sidebar({ role, open }: { role: Role; open: boolean }) {
  const { d, locale } = useI18n();
  const pathname = usePathname();
  const materialsLabel = authStrings[locale].myMaterials;
  const groupsLabel = groupStrings[locale].title;

  const teacherItems = [
    { icon: LayoutDashboard, label: d.sidebarTeacher.home, href: "/demo/teacher" },
    { icon: BookOpen, label: d.sidebarTeacher.lessons, href: "/demo/lesson" },
    { icon: FolderOpen, label: d.sidebarTeacher.topics, href: "/demo/lesson" },
    { icon: ClipboardList, label: d.sidebarTeacher.assignments, href: "/demo/lesson" },
    { icon: Users, label: groupsLabel, href: "/demo/groups" },
    { icon: Sparkles, label: d.gen.title, href: "/demo/generate" },
    { icon: Library, label: d.sidebarTeacher.library, href: "/demo/teacher" },
    { icon: Bot, label: d.sidebarTeacher.aiAssistant, href: "/demo/teacher" },
    { icon: BarChart3, label: d.sidebarTeacher.reports, href: "/demo/reports" },
    { icon: TrendingUp, label: d.analytics.title, href: "/demo/analytics" },
    { icon: FolderArchive, label: materialsLabel, href: "/demo/materials" },
    { icon: MessageSquare, label: d.sidebarTeacher.messages, href: "/demo/teacher" },
    { icon: Settings, label: d.sidebarTeacher.settings, href: "/demo/teacher" },
  ];

  const studentItems = [
    { icon: LayoutDashboard, label: d.sidebarStudent.home, href: "/demo/student" },
    { icon: Users, label: groupsLabel, href: "/demo/groups" },
    { icon: ClipboardList, label: d.sidebarStudent.assignments, href: "/demo/student" },
    { icon: BookOpen, label: d.sidebarStudent.lessons, href: "/demo/student" },
    { icon: Library, label: d.sidebarStudent.library, href: "/demo/student" },
    { icon: Bot, label: d.sidebarStudent.aiTutor, href: "/demo/tutor" },
    { icon: ListChecks, label: d.sidebarStudent.tests, href: "/demo/quiz" },
    { icon: Trophy, label: d.sidebarStudent.achievements, href: "/demo/student" },
    { icon: FolderArchive, label: materialsLabel, href: "/demo/materials" },
    { icon: Settings, label: d.sidebarStudent.settings, href: "/demo/student" },
  ];

  const items = role === "teacher" ? teacherItems : studentItems;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold">
          EduAI <span className="text-primary">OS</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto p-3" style={{ maxHeight: "calc(100vh - 4rem)" }}>
        {items.map((item, i) => {
          const active =
            (item.href !== "/demo/teacher" && item.href !== "/demo/student" && pathname === item.href) ||
            (i === 0 && pathname === item.href);
          return (
            <Link
              key={`${item.label}-${i}`}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
