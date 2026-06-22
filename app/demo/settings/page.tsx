"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { Role } from "@/components/dashboard/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { d } = useI18n();
  const s = d.settings;
  const { user, refresh } = useAuth();

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [provider, setProvider] = useState<string>("email");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!active || !j) return;
        setHasPassword(Boolean(j.hasPassword));
        if (j.provider) setProvider(j.provider);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const saveName = async () => {
    if (name.trim().length < 2) return;
    setSavingName(true);
    setNameSaved(false);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await refresh();
        setNameSaved(true);
      }
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async () => {
    setPwMsg(null);
    if (next.length < 6) {
      setPwMsg({ ok: false, text: s.errShort });
      return;
    }
    if (next !== confirm) {
      setPwMsg({ ok: false, text: s.errMismatch });
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setPwMsg({ ok: true, text: s.pwSaved });
        setCurrent("");
        setNext("");
        setConfirm("");
        setHasPassword(true);
      } else {
        setPwMsg({ ok: false, text: j.error === "wrong_password" ? s.errWrong : s.errShort });
      }
    } finally {
      setSavingPw(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800";
  const label = "mb-1.5 block text-sm font-medium";

  return (
    <DashboardShell role={(user?.role as Role) ?? "student"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{s.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{s.subtitle}</p>
      </div>

      <div className="grid max-w-2xl gap-6">
        {/* Profile */}
        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <User className="h-4 w-4 text-primary" /> {s.profile}
          </h3>
          <div className="space-y-4">
            <div>
              <label className={label}>{s.name}</label>
              <input value={name} onChange={(e) => { setName(e.target.value); setNameSaved(false); }} className={field} />
            </div>
            <div>
              <label className={label}>{s.email}</label>
              <input value={user?.email ?? ""} disabled className={field} />
              <p className="mt-1 text-xs text-slate-400">{s.emailHint}</p>
            </div>
            <Button onClick={saveName} disabled={savingName || name.trim().length < 2 || name === user?.name}>
              {savingName ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {s.saving}</>
              ) : nameSaved ? (
                s.saved
              ) : (
                s.save
              )}
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Lock className="h-4 w-4 text-primary" /> {s.security}
          </h3>
          {hasPassword === false && (
            <p className="mb-4 rounded-xl bg-primary/5 px-3 py-2 text-xs text-slate-500">
              {s.oauthHint} ({provider})
            </p>
          )}
          <div className="space-y-4">
            {hasPassword && (
              <div>
                <label className={label}>{s.currentPassword}</label>
                <input
                  type="password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className={field}
                />
              </div>
            )}
            <div>
              <label className={label}>{s.newPassword}</label>
              <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>{s.confirmPassword}</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={field} />
            </div>
            {pwMsg && (
              <p className={`text-sm ${pwMsg.ok ? "text-emerald-500" : "text-rose-500"}`}>{pwMsg.text}</p>
            )}
            <Button onClick={savePassword} disabled={savingPw || !next || !confirm}>
              {savingPw ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> {s.saving}</>
              ) : hasPassword ? (
                s.changePassword
              ) : (
                s.setPassword
              )}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
