import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "teacher") {
    return NextResponse.json({ error: "teacher_only" }, { status: 403 });
  }

  // All submissions across this teacher's groups.
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

  // Expected submissions = quiz assignments × members of their group.
  const quizAssignments = await prisma.assignment.findMany({
    where: { group: { teacherId: user.id }, material: { kind: "quiz" } },
    select: { group: { select: { _count: { select: { members: true } } } } },
  });
  const expected = quizAssignments.reduce((a, x) => a + x.group._count.members, 0);
  const completionRate = expected ? Math.round((total / expected) * 100) : 0;

  // Score distribution bands.
  const band = (lo: number, hi: number) =>
    subs.filter((s) => s.score >= lo && s.score <= hi).length;
  const bands = [
    { key: "excellent", count: band(90, 100), color: "#7c5cff" },
    { key: "good", count: band(70, 89), color: "#3b82f6" },
    { key: "satisfactory", count: band(50, 69), color: "#10b981" },
    { key: "poor", count: band(0, 49), color: "#f43f5e" },
  ];
  const distribution = bands.map((b) => ({
    key: b.key,
    value: total ? Math.round((b.count / total) * 100) : 0,
    count: b.count,
    color: b.color,
  }));

  // Recent results (last 8 submissions, chronological) for the trend line.
  const recent = subs.slice(-8).map((s) => ({
    label: s.student.name.split(" ")[0].slice(0, 6),
    value: s.score,
  }));

  return NextResponse.json({
    total,
    avgScore,
    activeStudents,
    completionRate,
    distribution,
    recent,
  });
}
