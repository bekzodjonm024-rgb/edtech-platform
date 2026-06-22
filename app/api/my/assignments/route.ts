import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// Assignments across all of the signed-in student's groups, with their own
// submission status attached. Powers the student dashboard list.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "student_only" }, { status: 403 });
  }

  const memberships = await prisma.membership.findMany({
    where: { studentId: user.id },
    select: { groupId: true },
  });
  const groupIds = memberships.map((m) => m.groupId);
  if (groupIds.length === 0) return NextResponse.json({ assignments: [] });

  const rows = await prisma.assignment.findMany({
    where: { groupId: { in: groupIds } },
    orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
    select: {
      id: true,
      dueAt: true,
      material: { select: { kind: true, topic: true, subject: true } },
      group: { select: { name: true, subject: true } },
      submissions: {
        where: { studentId: user.id },
        select: { score: true },
        take: 1,
      },
    },
  });

  const assignments = rows.map((r) => {
    const sub = r.submissions[0];
    const done = !!sub;
    return {
      id: r.id,
      topic: r.material.topic,
      subject: r.material.subject ?? r.group.subject ?? r.group.name,
      kind: r.material.kind,
      dueAt: r.dueAt,
      done,
      score: sub?.score ?? null,
      progress: done ? 100 : 0,
    };
  });

  return NextResponse.json({ assignments });
}
