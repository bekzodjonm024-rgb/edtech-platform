"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { authStrings } from "@/lib/i18n/auth-strings";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const a = authStrings[locale];
  const [open, setOpen] = useState(false);

  const launchHref = user
    ? user.role === "student"
      ? "/demo/student"
      : "/demo/teacher"
    : "/register";

  const links = [
    { href: "/features", label: t.nav.features },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg">
            EduAI <span className="text-primary">OS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          {!user && (
            <Link href="/login" className="hidden sm:block">
              <Button size="sm" variant="ghost">{a.signInBtn}</Button>
            </Link>
          )}
          <Link href={launchHref} className="hidden sm:block">
            <Button size="sm">{t.nav.launch}</Button>
          </Link>
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <Container className="flex flex-col gap-3 border-t border-slate-200 py-4 md:hidden dark:border-slate-800">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2">
            <LanguageSwitcher />
            <Link href={launchHref} onClick={() => setOpen(false)}>
              <Button size="sm">{t.nav.launch}</Button>
            </Link>
          </div>
        </Container>
      )}
    </header>
  );
}
