"use client";

import { useI18n } from "@/lib/i18n/context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Search, Bell, Menu, LogOut } from "lucide-react";

export function Topbar({
  name,
  role,
  onMenu,
  onLogout,
}: {
  name: string;
  role: string;
  onMenu: () => void;
  onLogout?: () => void;
}) {
  const { d } = useI18n();
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
      <button
        onClick={onMenu}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder={d.search}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-800"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        <ThemeToggle />
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 dark:border-slate-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            {initials}
          </span>
          <div className="hidden text-left sm:block">
            <div className="text-xs font-semibold leading-tight">{name}</div>
            <div className="text-[11px] text-slate-400">{role}</div>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            aria-label="Log out"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-500 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}
