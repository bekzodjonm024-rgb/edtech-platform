"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { materialTypes, mockSlides } from "@/lib/mock-data";
import { authStrings } from "@/lib/i18n/auth-strings";
import { Sparkles, Loader2, Check, FileText, Save } from "lucide-react";

type Slide = { title: string; body?: string };
type QuizQ = { q: string; options: string[]; answer: number };
type Essay = { prompt: string; guidance?: string; expectedLength?: string; rubric?: string[] };

export default function GeneratePage() {
  const { d, locale } = useI18n();
  const a = authStrings[locale];
  const [topic, setTopic] = useState("Fotosintez molekulyar mexanizmi");
  const [grade, setGrade] = useState("2");
  const [subject, setSubject] = useState("Molekulyar biologiya");
  const [duration, setDuration] = useState("80");
  const [selected, setSelected] = useState<string[]>(materialTypes.map((m) => m.key));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Slide[] | null>(null);
  const [usedAI, setUsedAI] = useState(false);
  const [quizReady, setQuizReady] = useState(false);
  const [quizAI, setQuizAI] = useState(false);
  const [genQuiz, setGenQuiz] = useState<QuizQ[] | null>(null);
  const [genEssay, setGenEssay] = useState<Essay | null>(null);
  const [essayAI, setEssayAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) =>
    setSelected((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));

  const generate = async () => {
    if (!topic.trim() || selected.length === 0) return;
    setLoading(true);
    setResult(null);
    setQuizReady(false);
    setSaved(false);
    setGenQuiz(null);
    setGenEssay(null);

    const headers = { "Content-Type": "application/json" };
    const body = { topic: topic.trim(), grade, subject, language: locale };
    const wantsQuiz = selected.includes("test");
    const wantsEssay = selected.includes("homework");

    const post = (url: string, payload: object) =>
      fetch(url, { method: "POST", headers, body: JSON.stringify(payload) }).then((r) =>
        r.ok ? r.json() : Promise.reject()
      );

    // Slides (always), quiz and essay (if selected) run in parallel.
    const [slidesRes, quizRes, essayRes] = await Promise.allSettled([
      post("/api/generate", body),
      wantsQuiz ? post("/api/generate-quiz", { ...body, count: 5 }) : Promise.reject(),
      wantsEssay ? post("/api/generate-essay", body) : Promise.reject(),
    ]);

    // Slides → AI result or local mock fallback.
    if (
      slidesRes.status === "fulfilled" &&
      Array.isArray(slidesRes.value.slides) &&
      slidesRes.value.slides.length
    ) {
      setResult(
        slidesRes.value.slides.map((s: { title: string; body?: string }) => ({
          title: s.title,
          body: s.body,
        }))
      );
      setUsedAI(true);
    } else {
      setResult(mockSlides(topic.trim()).map((t) => ({ title: t })));
      setUsedAI(false);
    }

    // Quiz → store AI questions (or null) so the quiz page can pick them up.
    if (wantsQuiz) {
      const questions =
        quizRes.status === "fulfilled" &&
        Array.isArray(quizRes.value.questions) &&
        quizRes.value.questions.length
          ? quizRes.value.questions
          : null;
      try {
        sessionStorage.setItem(
          "eduai-quiz",
          JSON.stringify({ topic: topic.trim(), questions })
        );
      } catch {
        /* sessionStorage unavailable — quiz page falls back to its sample */
      }
      setGenQuiz(questions);
      setQuizAI(Boolean(questions));
      setQuizReady(true);
    }

    // Essay → AI prompt + rubric, or a local template fallback.
    if (wantsEssay) {
      if (essayRes.status === "fulfilled" && essayRes.value?.prompt) {
        const e = essayRes.value;
        setGenEssay({
          prompt: e.prompt,
          guidance: e.guidance,
          expectedLength: e.expectedLength,
          rubric: Array.isArray(e.rubric) ? e.rubric : [],
        });
        setEssayAI(true);
      } else {
        setGenEssay({
          prompt: `"${topic.trim()}" mavzusida tahliliy esse yozing: asosiy g'oyalarni o'z so'zlaringiz bilan tushuntiring va misollar keltiring.`,
          guidance: "Fikringizni aniq dalillar bilan asoslang.",
          expectedLength: "500-700 so'z",
          rubric: ["Mavzuni tushunish", "Dalillar va misollar", "Tuzilma va mantiq", "Til savodxonligi"],
        });
        setEssayAI(false);
      }
    }

    setLoading(false);
  };

  const save = async () => {
    if (!result) return;
    setSaving(true);
    const headers = { "Content-Type": "application/json" };
    try {
      await fetch("/api/materials", {
        method: "POST",
        headers,
        body: JSON.stringify({
          kind: "presentation",
          topic: topic.trim(),
          subject,
          data: result,
        }),
      });
      if (genQuiz && genQuiz.length) {
        await fetch("/api/materials", {
          method: "POST",
          headers,
          body: JSON.stringify({ kind: "quiz", topic: topic.trim(), subject, data: genQuiz }),
        });
      }
      if (genEssay) {
        await fetch("/api/materials", {
          method: "POST",
          headers,
          body: JSON.stringify({ kind: "essay", topic: topic.trim(), subject, data: genEssay }),
        });
      }
      setSaved(true);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-800";

  const noteFor = (key: string, note: string) => {
    if (!note) return "";
    if (key === "presentation") return `${note} ${d.gen.slidesWord}`;
    if (key === "test") return `${note} ${d.gen.questionsWord}`;
    return note;
  };

  return (
    <DashboardShell role="teacher">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold">{d.gen.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{d.gen.subtitle}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">{d.gen.klass}</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className={field}>
                {[1, 2, 3, 4].map((g) => (
                  <option key={g} value={g}>{g}-kurs</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{d.gen.subject}</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                list="subject-suggestions"
                placeholder="Masalan: Diskret matematika"
                className={field}
              />
              <datalist id="subject-suggestions">
                {[
                  "Molekulyar biologiya",
                  "Oliy matematika",
                  "Diskret matematika",
                  "Iqtisodiyot nazariyasi",
                  "Mikroiqtisodiyot",
                  "Dasturlash asoslari",
                  "Ma'lumotlar tuzilmalari",
                  "Fizika",
                  "Organik kimyo",
                  "Mikrobiologiya",
                  "Konstitutsiyaviy huquq",
                  "Falsafa",
                  "Chet tili",
                  "Pedagogika",
                ].map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">{d.gen.topic}</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={d.gen.topicPlaceholder}
                className={field}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{d.gen.duration}</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className={field}>
                {[45, 80, 90, 120, 160].map((x) => (
                  <option key={x} value={x}>{x} daqiqa</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{d.gen.language}</label>
              <select className={field} value={locale} disabled>
                <option value="uz">O&apos;zbek</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          </div>

          <Button
            onClick={generate}
            disabled={loading || !topic.trim() || selected.length === 0}
            className="mt-5 w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {d.gen.generating}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {d.gen.button}
              </>
            )}
          </Button>
        </Card>

        {/* Materials checklist */}
        <Card>
          <h3 className="mb-4 font-semibold">{d.gen.materialsToGenerate}</h3>
          <div className="space-y-2">
            {materialTypes.map((m) => {
              const checked = selected.includes(m.key);
              return (
                <button
                  key={m.key}
                  onClick={() => toggle(m.key)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    checked ? "border-primary/40 bg-primary/5" : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        checked ? "border-primary bg-primary text-white" : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span className="font-medium">{d.mat[m.key as keyof typeof d.mat]}</span>
                  </span>
                  {m.note && <span className="text-xs text-slate-400">{noteFor(m.key, m.note)}</span>}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Generated result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-semibold text-emerald-500">
                  <Check className="h-5 w-5" /> {d.gen.ready}
                  {usedAI ? (
                    <span className="rounded-pill bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      ✨ Claude AI
                    </span>
                  ) : (
                    <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800">
                      demo
                    </span>
                  )}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={save} disabled={saving || saved}>
                    {saving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {a.saving}</>
                    ) : saved ? (
                      a.saved
                    ) : (
                      <><Save className="h-4 w-4" /> {a.save}</>
                    )}
                  </Button>
                  {quizReady && (
                    <Link href="/demo/quiz">
                      <Button size="sm">
                        {d.qc.test} {quizAI && "✨"} →
                      </Button>
                    </Link>
                  )}
                  <Link href="/demo/presentation">
                    <Button size="sm" variant="outline">{d.qc.presentation} →</Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.map((s, i) => (
                  <motion.div
                    key={`${s.title}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        {s.title}
                      </div>
                      {s.body && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.body}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Essay preview */}
              {genEssay && (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <FileText className="h-4 w-4 text-primary" />
                    {d.mat.homework}
                    {essayAI ? (
                      <span className="rounded-pill bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        ✨ Claude AI
                      </span>
                    ) : (
                      <span className="rounded-pill bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700">
                        demo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{genEssay.prompt}</p>
                  {genEssay.expectedLength && (
                    <p className="mt-1 text-xs text-slate-400">📏 {genEssay.expectedLength}</p>
                  )}
                  {genEssay.rubric && genEssay.rubric.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {genEssay.rubric.map((r, i) => (
                        <li
                          key={i}
                          className="rounded-pill bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
