import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "student_only" }, { status: 403 });
  }

  const { assignmentId, score, correct, total, answers } = await req.json();
  if (!assignmentId || score == null || correct == null || total == null) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  const answersJson =
    Array.isArray(answers) ? JSON.stringify(answers) : null;

  // The student must be a member of the assignment's group.
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      group: { select: { members: { where: { studentId: user.id }, select: { id: true } } } },
    },
  });
  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.group.members.length === 0) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const s = Math.max(0, Math.min(100, Math.round(Number(score))));
  const c = Math.max(0, Math.round(Number(correct)));
  const t = Math.max(1, Math.round(Number(total)));

  await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId: user.id } },
    create: { assignmentId, studentId: user.id, score: s, correct: c, total: t, answers: answersJson },
    update: { score: s, correct: c, total: t, answers: answersJson },
  });

  return NextResponse.json({ ok: true });
}
