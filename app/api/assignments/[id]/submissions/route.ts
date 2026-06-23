import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: {
      id: true,
      dueAt: true,
      group: {
        select: {
          id: true,
          name: true,
          teacherId: true,
          members: {
            select: { student: { select: { id: true, name: true, email: true } } },
            orderBy: { joinedAt: "asc" },
          },
        },
      },
      material: {
        select: { kind: true, topic: true, subject: true, data: true },
      },
      submissions: {
        orderBy: { score: "desc" },
        select: {
          score: true,
          correct: true,
          total: true,
          answers: true,
          content: true,
          feedback: true,
          updatedAt: true,
          student: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.group.teacherId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const subMap = new Map(assignment.submissions.map((s) => [s.student.id, s]));

  let materialData: unknown = null;
  try { materialData = JSON.parse(assignment.material.data); } catch { materialData = null; }

  const members = assignment.group.members.map(({ student }) => {
    const sub = subMap.get(student.id);
    let answers: (number | null)[] | null = null;
    let feedback: unknown = null;
    if (sub?.answers) { try { answers = JSON.parse(sub.answers); } catch { answers = null; } }
    if (sub?.feedback) { try { feedback = JSON.parse(sub.feedback); } catch { feedback = null; } }
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      submitted: !!sub,
      score: sub?.score ?? null,
      correct: sub?.correct ?? null,
      total: sub?.total ?? null,
      answers,
      content: sub?.content ?? null,
      feedback,
      at: sub?.updatedAt ?? null,
    };
  });

  const submitted = members.filter((m) => m.submitted);
  const avg = submitted.length > 0
    ? Math.round(submitted.reduce((a, m) => a + (m.score ?? 0), 0) / submitted.length)
    : 0;

  return NextResponse.json({
    id: assignment.id,
    dueAt: assignment.dueAt,
    kind: assignment.material.kind,
    topic: assignment.material.topic,
    subject: assignment.material.subject,
    groupName: assignment.group.name,
    groupId: assignment.group.id,
    materialData,
    members,
    count: submitted.length,
    total: members.length,
    avg,
  });
}
