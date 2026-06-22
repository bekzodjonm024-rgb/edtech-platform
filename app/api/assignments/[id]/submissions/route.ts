import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// Teacher (owner of the assignment's group) views all student results.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: { id: true, group: { select: { teacherId: true } } },
  });
  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.group.teacherId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const subs = await prisma.submission.findMany({
    where: { assignmentId: id },
    orderBy: { score: "desc" },
    select: {
      score: true,
      correct: true,
      total: true,
      updatedAt: true,
      student: { select: { id: true, name: true } },
    },
  });

  const avg =
    subs.length > 0 ? Math.round(subs.reduce((a, s) => a + s.score, 0) / subs.length) : 0;

  return NextResponse.json({
    count: subs.length,
    avg,
    submissions: subs.map((s) => ({
      studentId: s.student.id,
      name: s.student.name,
      score: s.score,
      correct: s.correct,
      total: s.total,
      at: s.updatedAt,
    })),
  });
}
