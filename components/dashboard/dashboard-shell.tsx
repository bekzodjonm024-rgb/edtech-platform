"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, type Role } from "./sidebar";
import { Topbar } from "./topbar";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { Loader2 } from "lucide-react";

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  // Kept for backwards-compatibility; the shell now uses the signed-in user.
  userName?: string;
  userRole?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { d } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const roleLabel = user.role === "student" ? d.studentRole : d.teacherRole;

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex">
        <Sidebar role={role} open={open} />

        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            name={user.name}
            role={roleLabel}
            onMenu={() => setOpen(true)}
            onLogout={handleLogout}
          />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
