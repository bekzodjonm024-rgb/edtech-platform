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
    const completed = subs.length;
    const avg = completed
      ? Math.round(subs.reduce((a, s) => a + s.score, 0) / completed)
      : 0;
    // Points: each completed quiz contributes its score (0-100).
    const points = subs.reduce((a, s) => a + s.score, 0);

    // Achievements earned from real activity.
    const achievements = [
      { key: "explorer", earned: completed >= 1, points: 100 },
      { key: "taskMaster", earned: completed >= 5, points: 200 },
      { key: "topStudent", earned: completed >= 1 && avg >= 90, points: 500 },
    ].filter((a) => a.earned);

    return NextResponse.json({
      role: "student",
      groups: groupIds.length,
      assigned,
      completed,
      avgScore: avg,
      points,
      achievements,
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
    ? await prisma.submission.count({
        where: { assignment: { groupId: { in: groupIds } } },
      })
    : 0;
  const scored = groupIds.length
    ? await prisma.submission.aggregate({
        where: { assignment: { groupId: { in: groupIds } } },
        _avg: { score: true },
      })
    : null;
  const avg = scored?._avg.score != null ? Math.round(scored._avg.score) : 0;

  // Recent materials for the "recent lessons" widget.
  const recentMaterials = await prisma.material.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: { id: true, kind: true, topic: true, subject: true, createdAt: true },
  });

  // Assignment status: how many expected quiz submissions are in vs. outstanding.
  const quizAssignments = groupIds.length
    ? await prisma.assignment.findMany({
        where: { groupId: { in: groupIds }, material: { kind: "quiz" } },
        select: { group: { select: { _count: { select: { members: true } } } } },
      })
    : [];
  const expected = quizAssignments.reduce((a, x) => a + x.group._count.members, 0);
  const pending = Math.max(expected - subs, 0);

  return NextResponse.json({
    role: "teacher",
    groups: groupIds.length,
    students: studentCount,
    materials,
    assignments,
    avgScore: avg,
    submissions: subs,
    status: { submitted: subs, pending },
    recentMaterials,
  });
}
