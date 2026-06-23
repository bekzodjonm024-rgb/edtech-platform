"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  BookOpen,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Foydalanuvchilar", icon: Users },
  { href: "/admin/groups", label: "Guruhlar", icon: FolderOpen },
  { href: "/admin/materials", label: "Materiallar", icon: BookOpen },
];

export function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="flex items-center gap-3 border-b border-slate-700/50 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">EduAI Admin</div>
          <div className="text-[11px] text-slate-400">Control Panel</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "bg-primary text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-700/50 p-3 space-y-1">
        <Link
          href="/demo/teacher"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Saytga qaytish
        </Link>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-white">{user.name}</div>
            <div className="truncate text-[11px] text-slate-400">{user.email}</div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-rose-400 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-60">{sidebar}</div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {NAV.find((n) => isActive(n.href, n.exact))?.label ?? "Admin"}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto hidden text-slate-400 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
