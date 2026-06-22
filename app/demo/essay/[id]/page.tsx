"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Loader2, FileText, Lightbulb } from "lucide-react";

type Feedback = {
  strengths: string[];
  improvements: string[];
  detailed: string;
  score: number;
  pending?: boolean;
};

type EssayData = {
  prompt?: string;
  guidance?: string;
  expectedLength?: string;
  rubric?: string[];
};

type Assignment = {
  id: string;
  topic: string;
  subject: string;
  kind: string;
  data: EssayData | null;
  submission: { score: number; content: string | null; feedback: Feedback | null } | null;
};

function Stars({ score }: { score: number }) {
  return (
    <span className="text-lg tracking-tight">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= score ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function EssayPage() {
  const { id } = useParams<{ id: string }>();
  const { d, locale } = useI18n();
  const e = d.essay;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/my/assignments/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((a: Assignment) => {
        if (!active) return;
        setAssignment(a);
        if (a.submission) {
          setAnswer(a.submission.content ?? "");
          setFeedback(a.submission.feedback);
        }
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const submit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions/essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: id, content: answer, language: locale }),
      });
      if (res.ok) {
        const j = await res.json();
        setFeedback(j.feedback);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const data = assignment?.data ?? {};
  const submitted = !!feedback;

  return (
    <DashboardShell role="student">
      <Link
        href="/demo/student"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {e.back}
      </Link>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error || !assignment ? (
        <Card className="py-10 text-center text-sm text-slate-500">{e.notFound}</Card>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{assignment.topic}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{assignment.subject}</p>
          </div>

          {/* Task */}
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <FileText className="h-4 w-4 text-primary" /> {e.task}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200">{data.prompt}</p>
            {data.guidance && (
              <p className="mt-3 text-sm text-slate-500">
                <span className="font-medium">{e.guidance}: </span>
                {data.guidance}
              </p>
            )}
            {data.expectedLength && (
              <p className="mt-1 text-xs text-slate-400">📏 {e.expected}: {data.expectedLength}</p>
            )}
            {data.rubric && data.rubric.length > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 text-xs font-medium text-slate-500">{e.criteria}</div>
                <ul className="flex flex-wrap gap-1.5">
                  {data.rubric.map((r, i) => (
                    <li
                      key={i}
                      className="rounded-pill bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Answer */}
          <Card>
            <h3 className="mb-3 font-semibold">{e.yourAnswer}</h3>
            <textarea
              value={answer}
              onChange={(ev) => setAnswer(ev.target.value)}
              disabled={submitted || submitting}
              placeholder={e.placeholder}
              rows={10}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none transition-colors focus:border-primary disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800"
            />
            {!submitted && (
              <Button onClick={submit} disabled={!answer.trim() || submitting} className="mt-4 w-full" size="lg">
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {e.submitting}</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> {e.submit}</>
                )}
              </Button>
            )}
          </Card>

          {/* AI feedback */}
          {feedback && (
            <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-900/10">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-emerald-500" /> {e.feedbackTitle}
              </h3>

              {feedback.pending ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">{e.pending}</p>
              ) : (
                <div className="space-y-4 text-sm">
                  {feedback.strengths.length > 0 && (
                    <div>
                      <div className="mb-1 font-medium text-emerald-600 dark:text-emerald-400">
                        💪 {e.strengths}
                      </div>
                      <ul className="list-inside list-disc space-y-0.5 text-slate-700 dark:text-slate-200">
                        {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {feedback.improvements.length > 0 && (
                    <div>
                      <div className="mb-1 flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4" /> {e.improvements}
                      </div>
                      <ul className="list-inside list-disc space-y-0.5 text-slate-700 dark:text-slate-200">
                        {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {feedback.detailed && (
                    <div className="rounded-xl bg-white p-4 dark:bg-slate-800/60">
                      <div className="mb-1 font-medium">📝 {e.detailed}</div>
                      <p className="text-slate-600 dark:text-slate-300">{feedback.detailed}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{e.scoreLabel}:</span>
                    <Stars score={feedback.score} />
                    <span className="text-slate-500">({feedback.score}/5)</span>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
