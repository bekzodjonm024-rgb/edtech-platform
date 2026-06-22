"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "./container";
import { GraduationCap } from "lucide-react";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg">
              EduAI <span className="text-primary">OS</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.product}</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/features" className="hover:text-primary">{t.nav.features}</Link></li>
            <li><Link href="/demo/teacher" className="hover:text-primary">{t.nav.demo}</Link></li>
            <li><Link href="/pricing" className="hover:text-primary">{t.nav.pricing}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.company}</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/about" className="hover:text-primary">{t.nav.about}</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} EduAI OS. {t.footer.rights}
      </div>
    </footer>
  );
}
