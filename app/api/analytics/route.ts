import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// Richer teacher analytics: metrics, grade distribution, a submission
// timeline, and per-student progress. All derived from real submissions.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "teacher") {
    return NextResponse.json({ error: "teacher_only" }, { status: 403 });
  }

  const subs = await prisma.submission.findMany({
    where: { assignment: { group: { teacherId: user.id } } },
    orderBy: { updatedAt: "asc" },
    select: {
      score: true,
      studentId: true,
      updatedAt: true,
      student: { select: { name: true } },
    },
  });

  const total = subs.length;
  const avgScore = total ? Math.round(subs.reduce((a, s) => a + s.score, 0) / total) : 0;
  const activeStudents = new Set(subs.map((s) => s.studentId)).size;

  // Completion = submissions / (graded assignments × their group's members).
  const gradedAssignments = await prisma.assignment.findMany({
    where: {
      group: { teacherId: user.id },
      material: { kind: { in: ["quiz", "essay"] } },
    },
    select: { group: { select: { _count: { select: { members: true } } } } },
  });
  const expected = gradedAssignments.reduce((a, x) => a + x.group._count.members, 0);
  const completionRate = expected ? Math.round((total / expected) * 100) : 0;

  // Score distribution bands.
  const band = (lo: number, hi: number) =>
    subs.filter((s) => s.score >= lo && s.score <= hi).length;
  const distribution = [
    { key: "excellent", count: band(90, 100), color: "#7c5cff" },
    { key: "good", count: band(70, 89), color: "#3b82f6" },
    { key: "satisfactory", count: band(50, 69), color: "#10b981" },
    { key: "poor", count: band(0, 49), color: "#f43f5e" },
  ].map((b) => ({
    key: b.key,
    value: total ? Math.round((b.count / total) * 100) : 0,
    count: b.count,
    color: b.color,
  }));

  // Timeline: average score per day for the most recent days with activity.
  const byDay = new Map<string, { sum: number; n: number; date: Date }>();
  for (const s of subs) {
    const day = s.updatedAt.toISOString().slice(0, 10);
    const cur = byDay.get(day) ?? { sum: 0, n: 0, date: s.updatedAt };
    cur.sum += s.score;
    cur.n += 1;
    byDay.set(day, cur);
  }
  const timeline = Array.from(byDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([, v]) => ({
      label: v.date.toLocaleDateString([], { day: "numeric", month: "short" }),
      value: Math.round(v.sum / v.n),
    }));

  // Per-student progress.
  const byStudent = new Map<string, { name: string; sum: number; n: number; last: Date }>();
  for (const s of subs) {
    const cur =
      byStudent.get(s.studentId) ?? { name: s.student.name, sum: 0, n: 0, last: s.updatedAt };
    cur.sum += s.score;
    cur.n += 1;
    if (s.updatedAt > cur.last) cur.last = s.updatedAt;
    byStudent.set(s.studentId, cur);
  }
  const studentProgress = Array.from(byStudent.values())
    .map((v) => ({
      name: v.name,
      submissions: v.n,
      avgScore: Math.round(v.sum / v.n),
      lastActive: v.last.toISOString(),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  return NextResponse.json({
    metrics: { total, avgScore, activeStudents, completionRate, expected },
    distribution,
    timeline,
    studentProgress,
  });
}
