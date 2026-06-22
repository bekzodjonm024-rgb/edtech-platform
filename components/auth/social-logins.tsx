"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

type Providers = { google: boolean; telegram: boolean; telegramBot: string | null };

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 34.6 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.5l6.5 5.5C41.4 36.3 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#229ED9"
        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm5.56 8.16-1.86 8.76c-.14.62-.5.77-1.02.48l-2.82-2.08-1.36 1.31c-.15.15-.28.28-.56.28l.2-2.86 5.2-4.7c.23-.2-.05-.31-.35-.11l-6.43 4.05-2.77-.87c-.6-.19-.62-.6.13-.89l10.83-4.17c.5-.18.94.12.78.81Z"
      />
    </svg>
  );
}

export function SocialLogins({ role = "student" }: { role?: "teacher" | "student" }) {
  const { locale } = useI18n();
  const [providers, setProviders] = useState<Providers | null>(null);

  const t = {
    or: { uz: "yoki", en: "or", ru: "или" }[locale],
    google: { uz: "Google orqali kirish", en: "Continue with Google", ru: "Войти через Google" }[locale],
    telegram: { uz: "Telegram orqali kirish", en: "Continue with Telegram", ru: "Войти через Telegram" }[locale],
  };

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then(setProviders)
      .catch(() => setProviders({ google: false, telegram: false, telegramBot: null }));
  }, []);

  if (!providers || (!providers.google && !providers.telegram)) return null;

  const btn =
    "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800";

  return (
    <div className="mt-5">
      <div className="relative my-4 text-center">
        <span className="relative z-10 bg-white px-3 text-xs text-slate-400 dark:bg-slate-900">
          {t.or}
        </span>
        <div className="absolute left-0 top-1/2 h-px w-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="space-y-2">
        {providers.google && (
          <a href={`/api/auth/google?role=${role}`} className={btn}>
            <GoogleIcon />
            {t.google}
          </a>
        )}
        {providers.telegram && (
          <a href={`/api/auth/telegram/start?role=${role}`} className={btn}>
            <TelegramIcon />
            {t.telegram}
          </a>
        )}
      </div>
    </div>
  );
}
