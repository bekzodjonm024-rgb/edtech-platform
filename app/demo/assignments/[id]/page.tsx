"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { ProgressRing } from "@/components/demo/progress-ring";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Users,
  ListChecks,
  Presentation,
  FileText,
  CalendarClock,
} from "lucide-react";

type Question = { q: string; options: string[]; answer: number };

type Member = {
  id: string;
  name: string;
  email: string;
  submitted: boolean;
  score: number | null;
  correct: number | null;
  total: number | null;
  answers: (number | null)[] | null;
  content: string | null;
  feedback: { score: number; strengths: string[]; improvements: string[] } | null;
  at: string | null;
};

type AssignmentDetail = {
  id: string;
  dueAt: string | null;
  kind: string;
  topic: string;
  subject: string | null;
  groupName: string;
  groupId: string;
  materialData: { questions?: Question[] } | null;
  members: Member[];
  count: number;
  total: number;
  avg: number;
};

const kindIcon = (kind: string) => {
  if (kind === "quiz") return <ListChecks className="h-4 w-4" />;
  if (kind === "essay") return <FileText className="h-4 w-4" />;
  return <Presentation className="h-4 w-4" />;
};

function QuizReview({ member, questions }: { member: Member; questions: Question[] }) {
  const [open, setOpen] = useState(false);
  if (!member.answers) return null;
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        Javoblarni ko&apos;rish {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          {questions.map((q, i) => {
            const chosen = member.answers![i] ?? null;
            const isCorrect = chosen === q.answer;
            const isSkipped = chosen === null;
            return (
              <div key={i} className="rounded-lg border border-slate-200 p-2.5 text-xs dark:border-slate-700">
                <div className="mb-1.5 flex items-start gap-1.5">
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isSkipped ? "bg-slate-200 text-slate-500" : isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}>
                    {isSkipped ? "—" : isCorrect ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                  </span>
                  <span className="font-medium">{i + 1}. {q.q}</span>
                </div>
                <div className="ml-5 space-y-1">
                  {q.options.map((opt, oi) => {
                    const isChosen = oi === chosen;
                    const isRight = oi === q.answer;
                    return (
                      <div key={oi} className={`rounded px-2 py-0.5 ${
                        isRight ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                        : isChosen && !isCorrect ? "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
                        : "text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                        {isRight && <span className="ml-1 text-[10px] font-semibold">✓</span>}
                        {isChosen && !isCorrect && <span className="ml-1 text-[10px]">← talaba</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { locale } = useI18n();
  const [data, setData] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/assignments/${id}/submissions`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <DashboardShell role="teacher">
        <div className="flex justify-center py-20"><Spinner /></div>
      </DashboardShell>
    );
  }

  if (error || !data) {
    return (
      <DashboardShell role="teacher">
        <Link href="/demo/groups" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Guruhlarga qaytish
        </Link>
        <Card className="py-10 text-center text-sm text-slate-500">Topshiriq topilmadi</Card>
      </DashboardShell>
    );
  }

  const questions = data.materialData?.questions ?? [];
  const submittedMembers = data.members.filter((m) => m.submitted);
  const pendingMembers = data.members.filter((m) => !m.submitted);
  const completionPct = data.total > 0 ? Math.round((data.count / data.total) * 100) : 0;
  const isOverdue = data.dueAt ? new Date(data.dueAt) < new Date() : false;

  return (
    <DashboardShell role="teacher">
      <Link
        href={`/demo/groups`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {data.groupName}
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary">{kindIcon(data.kind)}</span>
            <h1 className="text-2xl font-bold">{data.topic}</h1>
            <span className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold ${
              data.kind === "quiz" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              : data.kind === "essay" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
              : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
            }`}>
              {data.kind === "quiz" ? "Test" : data.kind === "essay" ? "Uy vazifasi" : "Taqdimot"}
            </span>
          </div>
          {data.subject && <p className="mt-1 text-sm text-slate-500">{data.subject}</p>}
          {data.dueAt && (
            <div className={`mt-1 flex items-center gap-1.5 text-sm ${isOverdue ? "text-rose-500" : "text-slate-500"}`}>
              <CalendarClock className="h-4 w-4" />
              {isOverdue ? "Muddati o'tgan" : "Muddat"}: {new Date(data.dueAt).toLocaleDateString(locale)}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <ProgressRing value={completionPct} size={64} label={`${data.count}/${data.total}`} />
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Topshirish</div>
            <div className="text-2xl font-bold">{completionPct}%</div>
            <div className="text-xs text-slate-400">{data.count} ta talaba</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
            data.avg >= 85 ? "bg-emerald-100 text-emerald-600" : data.avg >= 60 ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
          }`}>
            {data.avg}%
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{"O'rtacha ball"}</div>
            <div className="text-2xl font-bold">{data.avg}%</div>
            <div className="text-xs text-slate-400">
              {data.avg >= 85 ? "A'lo" : data.avg >= 60 ? "Yaxshi" : "Past"}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Users className="h-7 w-7 text-slate-500" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Guruh</div>
            <div className="text-lg font-bold">{data.groupName}</div>
            <div className="text-xs text-slate-400">{data.total} ta talaba</div>
          </div>
        </Card>
      </div>

      {/* Submitted students */}
      {submittedMembers.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 font-semibold text-slate-700 dark:text-slate-200">
            Topshirdilar <span className="text-slate-400 font-normal">({submittedMembers.length})</span>
          </h2>
          <Table>
            <THead>
              <TR>
                <TH>Talaba</TH>
                {data.kind === "quiz" && <TH>To&apos;g&apos;ri</TH>}
                <TH>Ball</TH>
                <TH>Vaqt</TH>
                {data.kind === "quiz" && questions.length > 0 && <TH>Javoblar</TH>}
                {data.kind === "essay" && <TH>Baholash</TH>}
              </TR>
            </THead>
            <TBody>
              {submittedMembers.map((m) => (
                <TR key={m.id}>
                  <TD>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {m.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.email}</div>
                      </div>
                    </div>
                  </TD>
                  {data.kind === "quiz" && (
                    <TD className="text-sm text-slate-500">
                      {m.correct}/{m.total}
                    </TD>
                  )}
                  <TD>
                    <span className={`font-bold ${
                      (m.score ?? 0) >= 85 ? "text-emerald-500" : (m.score ?? 0) >= 60 ? "text-amber-500" : "text-rose-500"
                    }`}>
                      {m.score}%
                    </span>
                  </TD>
                  <TD className="text-xs text-slate-500">
                    {m.at ? new Date(m.at).toLocaleDateString(locale) : "—"}
                  </TD>
                  {data.kind === "quiz" && questions.length > 0 && (
                    <TD>
                      <QuizReview member={m} questions={questions} />
                    </TD>
                  )}
                  {data.kind === "essay" && (
                    <TD>
                      {m.feedback ? (
                        <div className="text-xs">
                          <div className="font-medium text-emerald-600">{m.feedback.score}/5 ⭐</div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Kutilmoqda</span>
                      )}
                    </TD>
                  )}
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}

      {/* Pending students */}
      {pendingMembers.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-slate-500">
            Topshirmadilar <span className="font-normal">({pendingMembers.length})</span>
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {pendingMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-500 dark:bg-slate-700">
                  {m.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-600 dark:text-slate-300">{m.name}</div>
                  <div className="truncate text-xs text-slate-400">{m.email}</div>
                </div>
                <span className="ml-auto shrink-0 rounded-pill bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700">
                  Kutilmoqda
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.members.length === 0 && (
        <Card className="py-10 text-center text-sm text-slate-400">
          Guruhda hali talaba yo&apos;q
        </Card>
      )}
    </DashboardShell>
  );
}
