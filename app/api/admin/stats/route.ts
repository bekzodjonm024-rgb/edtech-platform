import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [
    totalUsers,
    teachers,
    students,
    admins,
    totalGroups,
    totalMaterials,
    presentations,
    quizzes,
    essays,
    totalSubmissions,
    recentUsers,
    recentSubmissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "teacher" } }),
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.group.count(),
    prisma.material.count(),
    prisma.material.count({ where: { kind: "presentation" } }),
    prisma.material.count({ where: { kind: "quiz" } }),
    prisma.material.count({ where: { kind: "essay" } }),
    prisma.submission.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, provider: true, createdAt: true },
    }),
    prisma.submission.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        score: true,
        updatedAt: true,
        student: { select: { name: true, email: true } },
        assignment: { select: { material: { select: { topic: true, kind: true } } } },
      },
    }),
  ]);

  return NextResponse.json({
    users: { total: totalUsers, teachers, students, admins },
    groups: totalGroups,
    materials: { total: totalMaterials, presentations, quizzes, essays },
    submissions: totalSubmissions,
    recentUsers,
    recentSubmissions,
  });
}
