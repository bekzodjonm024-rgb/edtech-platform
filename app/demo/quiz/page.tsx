"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ProgressRing } from "@/components/demo/progress-ring";
import { quizQuestions as sampleQuiz } from "@/lib/mock-data";
import { ArrowLeft, ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react";

export default function QuizPage() {
  const { s } = useI18n();
  const [questions, setQuestions] = useState(sampleQuiz);
  const [quizTitle, setQuizTitle] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(sampleQuiz.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  // Pick up an AI-generated quiz from the generator, if present.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("eduai-quiz");
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.questions) && data.questions.length) {
        setQuestions(data.questions);
        setAnswers(Array(data.questions.length).fill(null));
        setCurrent(0);
        if (typeof data.topic === "string") setQuizTitle(data.topic);
      }
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  const q = questions[current];
  const answeredCount = answers.filter((a) => a !== null).length;

  const choose = (oi: number) =>
    setAnswers((p) => p.map((a, i) => (i === current ? oi : a)));

  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const incorrect = answers.filter((a, i) => a !== null && a !== questions[i].answer).length;
  const skipped = answers.filter((a) => a === null).length;
  const score = Math.round((correct / questions.length) * 100);

  /* ---------- Result screen ---------- */
  if (submitted) {
    const verdict = score >= 85 ? s.quiz.excellent : score >= 60 ? s.quiz.good : s.quiz.keepGoing;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center">
            <ProgressRing value={score} size={150} label={`${correct}/${questions.length}`} />
            <h1 className="mt-4 text-2xl font-bold">{verdict}</h1>
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <div className="text-lg font-bold text-emerald-500">{correct}</div>
                <div className="text-xs text-slate-500">{s.quiz.correctLabel}</div>
              </div>
              <div className="rounded-xl bg-rose-500/10 p-3">
                <div className="text-lg font-bold text-rose-500">{incorrect}</div>
                <div className="text-xs text-slate-500">{s.quiz.incorrectLabel}</div>
              </div>
              <div className="rounded-xl bg-slate-500/10 p-3">
                <div className="text-lg font-bold text-slate-400">{skipped}</div>
                <div className="text-xs text-slate-500">{s.quiz.skippedLabel}</div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setAnswers(Array(questions.length).fill(null));
                  setCurrent(0);
                  setSubmitted(false);
                }}
              >
                <RotateCcw className="h-4 w-4" /> {s.quiz.retry}
              </Button>
              <Link href="/demo/student" className="flex-1">
                <Button className="w-full">{s.quiz.back}</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* ---------- Quiz screen ---------- */
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <Link href="/demo/student" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          {s.quiz.back}
        </Link>
        <div className="mx-auto truncate px-2 text-sm font-semibold">
          {quizTitle || s.quiz.title}
        </div>
        <ThemeToggle />
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-6 p-4 lg:grid-cols-3">
        {/* Question */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>{current + 1} / {questions.length}</span>
                <span>{answeredCount} {s.quiz.answered.toLowerCase()}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="mb-5 text-lg font-semibold">
              {current + 1}. {q.q}
            </h2>

            <div className="space-y-2.5">
              {q.options.map((opt, oi) => {
                const selected = answers[current] === oi;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(oi)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-primary/40 dark:border-slate-700"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                        selected ? "border-primary bg-primary text-white" : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setCurrent((p) => Math.max(0, p - 1))} disabled={current === 0}>
                <ChevronLeft className="h-4 w-4" /> {s.quiz.prev}
              </Button>
              {current === questions.length - 1 ? (
                <Button size="sm" onClick={() => setSubmitted(true)}>
                  {s.quiz.submit}
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setCurrent((p) => Math.min(questions.length - 1, p + 1))}>
                  {s.quiz.next} <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Navigation grid */}
        <div>
          <Card>
            <h3 className="mb-4 font-semibold">{s.quiz.questions}</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => {
                const isCurrent = i === current;
                const isAnswered = answers[i] !== null;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      isCurrent
                        ? "bg-primary text-white"
                        : isAnswered
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <ul className="mt-5 space-y-2 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-500/40" /> {s.quiz.answered}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-primary" /> {s.quiz.current}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" /> {s.quiz.notAnswered}
              </li>
            </ul>

            <Button className="mt-5 w-full" onClick={() => setSubmitted(true)}>
              {s.quiz.submit}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
