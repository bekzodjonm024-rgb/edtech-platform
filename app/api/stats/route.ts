import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (user.role === "student") {
    const memberships = await prisma.membership.findMany({
      where: { studentId: user.id },
      select: { groupId: true },
    });
    const groupIds = memberships.map((m) => m.groupId);
    const assigned = groupIds.length
      ? await prisma.assignment.count({ where: { groupId: { in: groupIds } } })
      : 0;
    const subs = await prisma.submission.findMany({
      where: { studentId: user.id },
      select: { score: true },
    });
    const avg = subs.length
      ? Math.round(subs.reduce((a, s) => a + s.score, 0) / subs.length)
      : 0;
    return NextResponse.json({
      role: "student",
      groups: groupIds.length,
      assigned,
      completed: subs.length,
      avgScore: avg,
    });
  }

  // teacher
  const owned = await prisma.group.findMany({
    where: { teacherId: user.id },
    select: { id: true },
  });
  const groupIds = owned.map((g) => g.id);

  const memberships = groupIds.length
    ? await prisma.membership.findMany({
        where: { groupId: { in: groupIds } },
        select: { studentId: true },
      })
    : [];
  const studentCount = new Set(memberships.map((m) => m.studentId)).size;

  const materials = await prisma.material.count({ where: { userId: user.id } });
  const assignments = groupIds.length
    ? await prisma.assignment.count({ where: { groupId: { in: groupIds } } })
    : 0;

  const subs = groupIds.length
    ? await prisma.submission.findMany({
        where: { assignment: { groupId: { in: groupIds } } },
        select: { score: true },
      })
    : [];
  const avg = subs.length
    ? Math.round(subs.reduce((a, s) => a + s.score, 0) / subs.length)
    : 0;

  return NextResponse.json({
    role: "teacher",
    groups: groupIds.length,
    students: studentCount,
    materials,
    assignments,
    avgScore: avg,
  });
}
