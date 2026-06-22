"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { presentationSlides } from "@/lib/mock-data";
import { ArrowLeft, ChevronLeft, ChevronRight, Pencil, Download, Leaf } from "lucide-react";

export default function PresentationPage() {
  const { s } = useI18n();
  const [active, setActive] = useState(0);
  const slide = presentationSlides[active];

  const go = (dir: number) =>
    setActive((p) => Math.min(presentationSlides.length - 1, Math.max(0, p + dir)));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Topbar */}
      <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <Link href="/demo/lesson" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          {s.present.backToLesson}
        </Link>
        <div className="mx-auto truncate text-sm font-semibold">
          {s.present.title}: Fotosintezning molekulyar mexanizmi
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <Pencil className="h-4 w-4" /> {s.present.edit}
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4" /> {s.present.download}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
        {/* Thumbnails */}
        <div className="flex gap-3 overflow-x-auto lg:w-44 lg:flex-col lg:overflow-y-auto">
          {presentationSlides.map((sl, i) => (
            <button
              key={sl.title}
              onClick={() => setActive(i)}
              className={`flex aspect-video w-32 shrink-0 flex-col justify-center rounded-lg border p-2 text-left text-[10px] transition-colors lg:w-full ${
                active === i
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              <span className="font-semibold text-slate-400">{i + 1}</span>
              <span className="mt-1 line-clamp-2 font-medium">{sl.title}</span>
            </button>
          ))}
        </div>

        {/* Main slide */}
        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-card dark:border-slate-800 dark:from-slate-800 dark:to-slate-900 sm:p-12"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <Leaf className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">{slide.title}</h2>
              <p className="mt-1 text-lg text-slate-500 dark:text-slate-400">{slide.subtitle}</p>
              <p className="mt-5 max-w-2xl text-slate-600 dark:text-slate-300">{slide.body}</p>
              <div className="mt-6 inline-flex w-fit items-center rounded-xl bg-white px-5 py-3 font-mono text-sm font-semibold text-emerald-600 shadow-soft dark:bg-slate-950">
                {slide.formula}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide nav */}
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={active === 0}>
              <ChevronLeft className="h-4 w-4" /> {s.present.prev}
            </Button>
            <span className="text-sm text-slate-400">
              {active + 1} / {presentationSlides.length}
            </span>
            <Button variant="outline" size="sm" onClick={() => go(1)} disabled={active === presentationSlides.length - 1}>
              {s.present.next} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Speaker notes */}
        <div className="lg:w-72">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-semibold">{s.present.speakerNotes}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{slide.notes}</p>

            <h3 className="mb-3 mt-6 text-sm font-semibold">{s.present.keyConcepts}</h3>
            <div className="flex flex-wrap gap-2">
              {slide.points.map((p) => (
                <span
                  key={p}
                  className="rounded-pill bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
