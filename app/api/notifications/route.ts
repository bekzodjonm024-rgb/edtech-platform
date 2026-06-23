import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// GET — list the 20 most recent notifications for the current user,
// plus dynamically-computed "deadline today/tomorrow" alerts.
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const stored = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, kind: true, title: true, body: true, href: true, readAt: true, createdAt: true },
  });

  // For students: compute deadline alerts from assignments with dueAt in the next 48 hours.
  let deadlineAlerts: typeof stored = [];
  if (user.role === "student") {
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const upcoming = await prisma.assignment.findMany({
      where: {
        dueAt: { gte: now, lte: in48h },
        group: { members: { some: { studentId: user.id } } },
        submissions: { none: { studentId: user.id } },
      },
      select: {
        id: true,
        dueAt: true,
        material: { select: { kind: true, topic: true } },
      },
      take: 5,
    });

    deadlineAlerts = upcoming.map((a) => {
      const hoursLeft = Math.round((a.dueAt!.getTime() - now.getTime()) / (60 * 60 * 1000));
      const timeStr = hoursLeft <= 1 ? "1 soat qoldi" : `${hoursLeft} soat qoldi`;
      const href =
        a.material.kind === "quiz"
          ? `/demo/quiz/${a.id}`
          : a.material.kind === "essay"
          ? `/demo/essay/${a.id}`
          : `/demo/view/${a.id}`;
      return {
        id: `deadline-${a.id}`,
        kind: "deadline_soon",
        title: `Muddat yaqinlashmoqda — ${timeStr}`,
        body: a.material.topic,
        href,
        readAt: null,
        createdAt: new Date(),
      };
    });
  }

  const all = [...deadlineAlerts, ...stored];
  const unread = all.filter((n) => !n.readAt).length;

  return NextResponse.json({ notifications: all, unread });
}

// POST — mark all stored notifications as read.
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
