"use client";

import { useI18n } from "@/lib/i18n/context";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = { uz: "UZ", en: "EN", ru: "RU" };

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center rounded-xl border border-slate-200 p-0.5 dark:border-slate-700">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            locale === l
              ? "bg-primary text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          )}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
