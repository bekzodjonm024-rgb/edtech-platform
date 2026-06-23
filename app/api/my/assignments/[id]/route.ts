import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// One assignment, scoped to a student who belongs to its group, with the
// material payload and the student's own submission (if any).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "student_only" }, { status: 403 });
  }

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: {
      id: true,
      dueAt: true,
      group: {
        select: {
          name: true,
          subject: true,
          members: { where: { studentId: user.id }, select: { id: true } },
        },
      },
      material: { select: { kind: true, topic: true, subject: true, data: true } },
      submissions: {
        where: { studentId: user.id },
        select: { score: true, correct: true, total: true, content: true, feedback: true, answers: true },
        take: 1,
      },
    },
  });

  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.group.members.length === 0) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let data: unknown = null;
  try {
    data = JSON.parse(assignment.material.data);
  } catch {
    data = null;
  }

  const sub = assignment.submissions[0] ?? null;
  let feedback: unknown = null;
  if (sub?.feedback) {
    try {
      feedback = JSON.parse(sub.feedback);
    } catch {
      feedback = null;
    }
  }

  let storedAnswers: (number | null)[] | null = null;
  if (sub?.answers) {
    try { storedAnswers = JSON.parse(sub.answers); } catch { storedAnswers = null; }
  }

  return NextResponse.json({
    id: assignment.id,
    dueAt: assignment.dueAt,
    kind: assignment.material.kind,
    topic: assignment.material.topic,
    subject: assignment.material.subject ?? assignment.group.subject ?? assignment.group.name,
    data,
    submission: sub
      ? { score: sub.score, correct: sub.correct, total: sub.total, content: sub.content, feedback, answers: storedAnswers }
      : null,
  });
}
