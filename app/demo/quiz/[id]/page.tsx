"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ProgressRing } from "@/components/demo/progress-ring";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
} from "lucide-react";

type Question = { q: string; options: string[]; answer: number };

type QuizData = { questions: Question[] };

type Assignment = {
  id: string;
  topic: string;
  subject: string;
  kind: string;
  data: QuizData | null;
  submission: { score: number; correct: number; total: number } | null;
};

export default function QuizAssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const { s } = useI18n();
  const q = s.quiz;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number } | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/my/assignments/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((a: Assignment) => {
        if (!active) return;
        setAssignment(a);
        const total = a.data?.questions?.length ?? 0;
        setAnswers(Array(total).fill(null));
        if (a.submission) {
          setResult(a.submission);
          setSubmitted(true);
        }
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const questions = assignment?.data?.questions ?? [];
  const answeredCount = answers.filter((a) => a !== null).length;

  const choose = (oi: number) =>
    setAnswers((prev) => prev.map((a, i) => (i === current ? oi : a)));

  const handleSubmit = async () => {
    setSubmitting(true);
    const correct = answers.filter((a, i) => a === questions[i]?.answer).length;
    const total = questions.length;
    const score = Math.round((correct / total) * 100);
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: id, score, correct, total }),
      });
    } catch {
      /* ignore */
    }
    setResult({ score, correct, total });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <DashboardShell role="student">
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      </DashboardShell>
    );
  }

  if (error || !assignment || !questions.length) {
    return (
      <DashboardShell role="student">
        <Link
          href="/demo/student"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> {q.back}
        </Link>
        <Card className="py-10 text-center text-sm text-slate-500">
          {error ? "Topshiriq topilmadi" : "Quiz ma'lumotlari mavjud emas"}
        </Card>
      </DashboardShell>
    );
  }

  /* ---------- Result screen ---------- */
  if (submitted && result) {
    const verdict =
      result.score >= 85 ? q.excellent : result.score >= 60 ? q.good : q.keepGoing;
    const incorrect = result.total - result.correct;

    return (
      <DashboardShell role="student">
        <Link
          href="/demo/student"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> {q.back}
        </Link>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md"
        >
          <Card className="text-center">
            <div className="mb-1 text-sm text-slate-500">{assignment.topic}</div>
            <ProgressRing
              value={result.score}
              size={150}
              label={`${result.correct}/${result.total}`}
            />
            <h1 className="mt-4 text-2xl font-bold">{verdict}</h1>
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <div className="text-lg font-bold text-emerald-500">{result.correct}</div>
                <div className="text-xs text-slate-500">{q.correctLabel}</div>
              </div>
              <div className="rounded-xl bg-rose-500/10 p-3">
                <div className="text-lg font-bold text-rose-500">{incorrect}</div>
                <div className="text-xs text-slate-500">{q.incorrectLabel}</div>
              </div>
              <div className="rounded-xl bg-slate-500/10 p-3">
                <div className="text-lg font-bold text-slate-400">
                  {result.total - result.correct - incorrect}
                </div>
                <div className="text-xs text-slate-500">{q.skippedLabel}</div>
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
                  setResult(null);
                }}
              >
                <RotateCcw className="h-4 w-4" /> {q.retry}
              </Button>
              <Link href="/demo/student" className="flex-1">
                <Button className="w-full">{q.back}</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </DashboardShell>
    );
  }

  const currentQ = questions[current];

  /* ---------- Quiz screen ---------- */
  return (
    <DashboardShell role="student">
      <Link
        href="/demo/student"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {q.back}
      </Link>

      <div className="mb-4">
        <h1 className="text-xl font-bold">{assignment.topic}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.subject}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Question */}
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>
                  {current + 1} / {questions.length}
                </span>
                <span>
                  {answeredCount} {q.answered.toLowerCase()}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((current + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <h2 className="mb-5 text-lg font-semibold">
              {current + 1}. {currentQ.q}
            </h2>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, oi) => {
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
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {selected ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrent((p) => Math.max(0, p - 1))}
                disabled={current === 0}
              >
                <ChevronLeft className="h-4 w-4" /> {q.prev}
              </Button>
              {current === questions.length - 1 ? (
                <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? q.answered + "..." : q.submit}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrent((p) => Math.min(questions.length - 1, p + 1))
                  }
                >
                  {q.next} <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Navigation grid */}
        <div>
          <Card>
            <h3 className="mb-4 font-semibold">{q.questions}</h3>
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
                <span className="h-3 w-3 rounded bg-emerald-500/40" /> {q.answered}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-primary" /> {q.current}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-200 dark:bg-slate-700" />{" "}
                {q.notAnswered}
              </li>
            </ul>

            <Button
              className="mt-5 w-full"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? q.answered + "..." : q.submit}
            </Button>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
