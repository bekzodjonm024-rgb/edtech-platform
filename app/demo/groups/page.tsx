"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { groupStrings } from "@/lib/i18n/group-strings";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Copy,
  Check,
  Loader2,
  Trash2,
  UserPlus,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Presentation,
  FileText,
  Plus as PlusIcon,
} from "lucide-react";

type Assignment = {
  id: string;
  material: { id: string; kind: string; topic: string; subject: string | null; data: string };
};
type MyMaterial = { id: string; kind: string; topic: string; subject: string | null };

type Group = {
  id: string;
  name: string;
  subject: string | null;
  code: string;
  memberCount: number;
  teacherName?: string;
};

type Member = { id: string; name: string; email?: string; joinedAt: string };

export default function GroupsPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const g = groupStrings[locale];
  const role = user?.role === "student" ? "student" : "teacher";

  const [groups, setGroups] = useState<Group[] | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      const data = await res.json();
      setGroups(data.groups ?? []);
    } catch {
      setGroups([]);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-slate-700 dark:bg-slate-800";

  return (
    <DashboardShell role={role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{g.title}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {role === "teacher" ? g.teacherSubtitle : g.studentSubtitle}
        </p>
      </div>

      {role === "teacher" ? (
        <CreateGroup g={g} field={field} onCreated={load} />
      ) : (
        <JoinGroup g={g} field={field} onJoined={load} />
      )}

      <div className="mt-6 space-y-4">
        {groups === null ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : groups.length === 0 ? (
          <Card className="py-12 text-center text-slate-500 dark:text-slate-400">
            {role === "teacher" ? g.noGroupsTeacher : g.noGroupsStudent}
          </Card>
        ) : (
          groups.map((grp) =>
            role === "teacher" ? (
              <TeacherGroupCard key={grp.id} grp={grp} g={g} onChange={load} />
            ) : (
              <StudentGroupCard key={grp.id} grp={grp} g={g} />
            )
          )
        )}
      </div>
    </DashboardShell>
  );
}

/* ---------- Teacher: create form ---------- */
function CreateGroup({
  g,
  field,
  onCreated,
}: {
  g: (typeof groupStrings)["uz"];
  field: string;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), subject: subject.trim() }),
      });
      setName("");
      setSubject("");
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <Plus className="h-5 w-5 text-primary" /> {g.createGroup}
      </h3>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={g.groupNamePlaceholder}
          className={field}
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={g.subjectPlaceholder}
          className={field}
        />
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {loading ? g.creating : g.create}
        </Button>
      </form>
    </Card>
  );
}

/* ---------- Student: join form ---------- */
function JoinGroup({
  g,
  field,
  onJoined,
}: {
  g: (typeof groupStrings)["uz"];
  field: string;
  onJoined: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setOk(false);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (res.ok) {
        setOk(true);
        setCode("");
        onJoined();
      } else {
        const data = await res.json();
        setError(
          data.error === "invalid_code"
            ? g.errInvalidCode
            : data.error === "already_member"
            ? g.errAlreadyMember
            : g.errGeneric
        );
      }
    } catch {
      setError(g.errGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <UserPlus className="h-5 w-5 text-primary" /> {g.joinGroup}
      </h3>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={g.enterCode}
          className={`${field} font-mono uppercase tracking-wider`}
        />
        <Button type="submit" disabled={loading || !code.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {loading ? g.joining : g.join}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
      {ok && <p className="mt-2 text-sm text-emerald-500">{g.joined}</p>}
    </Card>
  );
}

/* ---------- Teacher group card (with members) ---------- */
function TeacherGroupCard({
  grp,
  g,
  onChange,
}: {
  grp: Group;
  g: (typeof groupStrings)["uz"];
  onChange: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[] | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(grp.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [materials, setMaterials] = useState<MyMaterial[]>([]);
  const [picked, setPicked] = useState("");

  const loadAssignments = async () => {
    const res = await fetch(`/api/groups/${grp.id}/assignments`, { cache: "no-store" });
    const data = await res.json();
    setAssignments(data.assignments ?? []);
  };

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && members === null) {
      const res = await fetch(`/api/groups/${grp.id}`, { cache: "no-store" });
      const data = await res.json();
      setMembers(data.members ?? []);
      await loadAssignments();
      const mres = await fetch("/api/materials", { cache: "no-store" });
      const mdata = await mres.json();
      setMaterials(mdata.materials ?? []);
    }
  };

  const assignedIds = new Set((assignments ?? []).map((a) => a.material.id));
  const assignable = materials.filter((m) => !assignedIds.has(m.id));

  const assign = async () => {
    if (!picked) return;
    await fetch(`/api/groups/${grp.id}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialId: picked }),
    });
    setPicked("");
    await loadAssignments();
  };

  const unassign = async (assignmentId: string) => {
    setAssignments((p) => (p ? p.filter((a) => a.id !== assignmentId) : p));
    await fetch(`/api/groups/${grp.id}/assignments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId }),
    });
  };

  const removeMember = async (studentId: string) => {
    setMembers((p) => (p ? p.filter((m) => m.id !== studentId) : p));
    await fetch(`/api/groups/${grp.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    onChange();
  };

  const deleteGroup = async () => {
    await fetch(`/api/groups/${grp.id}`, { method: "DELETE" });
    onChange();
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <div className="font-semibold">{grp.name}</div>
            <div className="text-xs text-slate-500">{grp.subject || "—"}</div>
          </div>
        </div>
        <button
          onClick={deleteGroup}
          aria-label={g.delete}
          className="text-slate-400 transition-colors hover:text-rose-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
          <span className="text-xs text-slate-500">{g.inviteCode}:</span>
          <span className="font-mono text-sm font-bold tracking-wider text-primary">{grp.code}</span>
          <button onClick={copy} className="text-slate-400 hover:text-primary" aria-label={g.copy}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <Badge>
          <Users className="h-3.5 w-3.5" /> {grp.memberCount} {g.members.toLowerCase()}
        </Badge>
        <button
          onClick={toggle}
          className="ml-auto flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {g.view} {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400">{g.shareHint}</p>

      {open && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          {members === null ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : members.length === 0 ? (
            <p className="py-2 text-center text-sm text-slate-400">{g.noMembers}</p>
          ) : (
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {m.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{m.name}</div>
                    {m.email && <div className="truncate text-xs text-slate-400">{m.email}</div>}
                  </div>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-xs text-slate-400 hover:text-rose-500"
                  >
                    {g.remove}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Assigned materials */}
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-semibold">{g.assignedTitle}</h4>
            {assignable.length > 0 ? (
              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <select
                  value={picked}
                  onChange={(e) => setPicked(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="">{g.selectMaterial}</option>
                  {assignable.map((m) => (
                    <option key={m.id} value={m.id}>
                      {(m.kind === "quiz" ? g.kindQuiz : g.kindPresentation)} · {m.topic}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={assign} disabled={!picked}>
                  <PlusIcon className="h-4 w-4" /> {g.assign}
                </Button>
              </div>
            ) : materials.length === 0 ? (
              <p className="mb-3 text-xs text-slate-400">{g.noMaterialsToAssign}</p>
            ) : null}

            {assignments && assignments.length === 0 ? (
              <p className="text-sm text-slate-400">{g.noAssigned}</p>
            ) : (
              <div className="space-y-2">
                {(assignments ?? []).map((a) => (
                  <AssignmentRow key={a.id} a={a} g={g} onUnassign={() => unassign(a.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------- Teacher: one assigned material (with quiz results) ---------- */
type SubmissionRow = {
  studentId: string;
  name: string;
  score: number;
  correct: number;
  total: number;
};
function AssignmentRow({
  a,
  g,
  onUnassign,
}: {
  a: Assignment;
  g: (typeof groupStrings)["uz"];
  onUnassign: () => void;
}) {
  const isQuiz = a.material.kind === "quiz";
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<{ count: number; avg: number; submissions: SubmissionRow[] } | null>(null);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && data === null) {
      const res = await fetch(`/api/assignments/${a.id}/submissions`, { cache: "no-store" });
      setData(await res.json());
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 px-3 py-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isQuiz ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
          }`}
        >
          {isQuiz ? <ListChecks className="h-4 w-4" /> : <Presentation className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{a.material.topic}</div>
          <div className="text-xs text-slate-400">
            {isQuiz ? g.kindQuiz : g.kindPresentation}
            {a.material.subject ? ` · ${a.material.subject}` : ""}
          </div>
        </div>
        {isQuiz && (
          <button
            onClick={toggle}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {g.results}
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
        <button onClick={onUnassign} className="text-xs text-slate-400 hover:text-rose-500">
          {g.unassign}
        </button>
      </div>

      {isQuiz && open && (
        <div className="border-t border-slate-200 px-3 py-2 dark:border-slate-700">
          {data === null ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          ) : data.submissions.length === 0 ? (
            <p className="py-1 text-center text-xs text-slate-400">{g.noSubmissions}</p>
          ) : (
            <>
              <div className="mb-2 text-xs text-slate-500">
                {g.avg}: <span className="font-semibold text-primary">{data.avg}%</span> · {data.count}
              </div>
              <div className="space-y-1">
                {data.submissions.map((s) => (
                  <div key={s.studentId} className="flex items-center justify-between text-sm">
                    <span className="truncate">{s.name}</span>
                    <span
                      className={`font-semibold ${
                        s.score >= 60 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {s.score}%{" "}
                      <span className="text-xs font-normal text-slate-400">
                        ({s.correct}/{s.total})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Student group card ---------- */
function StudentGroupCard({ grp, g }: { grp: Group; g: (typeof groupStrings)["uz"] }) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [openPres, setOpenPres] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/groups/${grp.id}/assignments`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAssignments(d.assignments ?? []))
      .catch(() => setAssignments([]));
  }, [grp.id]);

  const takeQuiz = (a: Assignment) => {
    try {
      const questions = JSON.parse(a.material.data);
      sessionStorage.setItem(
        "eduai-quiz",
        JSON.stringify({ topic: a.material.topic, questions, assignmentId: a.id })
      );
    } catch {
      /* ignore */
    }
    router.push("/demo/quiz");
  };

  const slidesOf = (a: Assignment): { title: string }[] => {
    try {
      const d = JSON.parse(a.material.data);
      return Array.isArray(d) ? d : [];
    } catch {
      return [];
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
          <Users className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{grp.name}</div>
          <div className="text-xs text-slate-500">
            {grp.subject || "—"}
            {grp.teacherName && ` · ${g.teacher}: ${grp.teacherName}`}
          </div>
        </div>
        <Badge className="border-secondary/20 bg-secondary/10 text-secondary">
          <Users className="h-3.5 w-3.5" /> {grp.memberCount}
        </Badge>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
        <h4 className="mb-2 text-sm font-semibold">{g.assignedTitle}</h4>
        {assignments === null ? (
          <div className="flex justify-center py-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-slate-400">{g.noAssigned}</p>
        ) : (
          <div className="space-y-2">
            {assignments.map((a) => (
              <div key={a.id}>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      a.material.kind === "quiz"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {a.material.kind === "quiz" ? (
                      <ListChecks className="h-4 w-4" />
                    ) : (
                      <Presentation className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.material.topic}</div>
                    <div className="text-xs text-slate-400">
                      {a.material.kind === "quiz" ? g.kindQuiz : g.kindPresentation}
                    </div>
                  </div>
                  {a.material.kind === "quiz" ? (
                    <Button size="sm" onClick={() => takeQuiz(a)}>
                      {g.take} →
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOpenPres(openPres === a.id ? null : a.id)}
                    >
                      {g.open}
                    </Button>
                  )}
                </div>
                {openPres === a.id && (
                  <ul className="mt-2 space-y-1 pl-11">
                    {slidesOf(a).slice(0, 8).map((s, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{s.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
