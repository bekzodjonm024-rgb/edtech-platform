"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const { t } = useI18n();

  const stats = [
    { value: t.hero.stat1, label: t.hero.stat1Label },
    { value: t.hero.stat2, label: t.hero.stat2Label },
    { value: t.hero.stat3, label: t.hero.stat3Label },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <Container className="py-20 text-center sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Badge>
            <Sparkles className="h-3.5 w-3.5" />
            {t.hero.badge}
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
        >
          {t.hero.title1}{" "}
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            {t.hero.title2}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/register">
            <Button size="lg">
              {t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/features">
            <Button size="lg" variant="outline">
              {t.hero.ctaSecondary}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-primary sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
