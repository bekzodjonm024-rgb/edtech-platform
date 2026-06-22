"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { authStrings } from "@/lib/i18n/auth-strings";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { locale } = useI18n();
  const a = authStrings[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace(user.role === "student" ? "/demo/student" : "/demo/teacher");
  }, [user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      router.replace(u.role === "student" ? "/demo/student" : "/demo/teacher");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setError(code === "invalid_credentials" ? a.errInvalid : a.errGeneric);
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg">EduAI <span className="text-primary">OS</span></span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold">{a.signInTitle}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.signInSubtitle}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">{a.email}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="you@university.uz" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{a.password}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} placeholder="••••••••" />
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {a.loading}</> : a.signInBtn}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {a.noAccount}{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {a.toSignUp}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
