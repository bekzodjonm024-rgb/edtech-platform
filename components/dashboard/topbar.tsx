"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Search, Bell, Menu, LogOut, CheckCheck } from "lucide-react";

type Notif = {
  id: string;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

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
  const notifDict = d.notif;
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j) return;
        setNotifs(j.notifications ?? []);
        setUnread(j.unread ?? 0);
      })
      .catch(() => {});
  }, []);

  // Close panel on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markRead = async () => {
    setUnread(0);
    setNotifs((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    await fetch("/api/notifications", { method: "POST" });
  };

  const handleBell = () => {
    setOpen((o) => !o);
    if (!open && unread > 0) markRead();
  };

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

        {/* Notification bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={handleBell}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-semibold">{notifDict.title}</span>
                {notifs.some((n) => !n.readAt) && (
                  <button
                    onClick={markRead}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    {notifDict.markRead}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">{notifDict.empty}</p>
                ) : (
                  notifs.map((n) => {
                    const isUnread = !n.readAt;
                    const content = (
                      <div
                        className={`flex gap-3 border-b border-slate-100 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 ${
                          isUnread ? "bg-primary/5" : ""
                        }`}
                      >
                        <span className="mt-0.5 text-base leading-none">
                          {n.kind === "deadline_soon" ? "⏰" : "📋"}
                        </span>
                        <div className="min-w-0">
                          <div className={`font-medium leading-snug ${isUnread ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
                            {n.title}
                          </div>
                          <div className="mt-0.5 truncate text-xs text-slate-500">{n.body}</div>
                        </div>
                        {isUnread && (
                          <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                    );
                    return n.href ? (
                      <Link key={n.id} href={n.href} onClick={() => setOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      <div key={n.id}>{content}</div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

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
