import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// Generate a readable invite code, e.g. "BIO-4X9K" (no ambiguous chars).
function makeCode(subject?: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let body = "";
  for (let i = 0; i < 5; i++) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const prefix = (subject || "GRP").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "GRP";
  return `${prefix}-${body}`;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (user.role === "student") {
    const memberships = await prisma.membership.findMany({
      where: { studentId: user.id },
      orderBy: { joinedAt: "desc" },
      select: {
        joinedAt: true,
        group: {
          select: {
            id: true,
            name: true,
            subject: true,
            code: true,
            teacher: { select: { name: true } },
            _count: { select: { members: true } },
          },
        },
      },
    });
    const groups = memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      subject: m.group.subject,
      code: m.group.code,
      teacherName: m.group.teacher.name,
      memberCount: m.group._count.members,
    }));
    return NextResponse.json({ role: "student", groups });
  }

  // teacher
  const owned = await prisma.group.findMany({
    where: { teacherId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      code: true,
      _count: { select: { members: true } },
    },
  });
  const groups = owned.map((g) => ({
    id: g.id,
    name: g.name,
    subject: g.subject,
    code: g.code,
    memberCount: g._count.members,
  }));
  return NextResponse.json({ role: "teacher", groups });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "teacher") {
    return NextResponse.json({ error: "teacher_only" }, { status: 403 });
  }

  const { name, subject } = await req.json();
  if (!name || !String(name).trim()) {
    return NextResponse.json({ error: "missing_name" }, { status: 400 });
  }

  // Ensure a unique code (retry on rare collision).
  let code = makeCode(subject);
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.group.findUnique({ where: { code } });
    if (!exists) break;
    code = makeCode(subject);
  }

  const group = await prisma.group.create({
    data: {
      name: String(name).trim(),
      subject: subject ? String(subject).trim() : null,
      code,
      teacherId: user.id,
    },
    select: { id: true, name: true, subject: true, code: true },
  });
  return NextResponse.json({ group: { ...group, memberCount: 0 } });
}
