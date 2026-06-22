"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Loader2 } from "lucide-react";

type Slide = { title: string; body?: string };

export default function ViewMaterialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [active, setActive] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/materials/${params.id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((m) => {
        setTopic(m.topic);
        try {
          const d = JSON.parse(m.data);
          setSlides(Array.isArray(d) ? d : []);
        } catch {
          setSlides([]);
        }
      })
      .catch(() => setError(true));
  }, [params.id]);

  const go = (dir: number) =>
    setActive((p) => Math.min((slides?.length ?? 1) - 1, Math.max(0, p + dir)));

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <p className="text-slate-500">Material topilmadi.</p>
        <Button className="mt-4" onClick={() => router.back()}>Orqaga</Button>
      </div>
    );
  }

  if (!slides) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const slide = slides[active];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="mx-auto truncate px-2 text-sm font-semibold">{topic}</div>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row">
        {/* Thumbnails */}
        <div className="flex gap-3 overflow-x-auto lg:w-44 lg:flex-col lg:overflow-y-auto">
          {slides.map((sl, i) => (
            <button
              key={i}
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
              className="flex flex-1 flex-col justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-primary/5 to-white p-8 shadow-card dark:border-slate-800 dark:from-slate-800 dark:to-slate-900 sm:p-12"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <FileText className="h-6 w-6" />
              </span>
              <div className="mt-4 text-sm font-medium text-primary">
                {active + 1} / {slides.length}
              </div>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{slide?.title}</h2>
              {slide?.body && (
                <p className="mt-5 max-w-2xl text-slate-600 dark:text-slate-300">{slide.body}</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={active === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-400">{active + 1} / {slides.length}</span>
            <Button variant="outline" size="sm" onClick={() => go(1)} disabled={active === slides.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
