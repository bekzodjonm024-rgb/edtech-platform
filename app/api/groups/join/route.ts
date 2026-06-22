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

  const { code } = await req.json();
  if (!code || !String(code).trim()) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const group = await prisma.group.findUnique({
    where: { code: String(code).trim().toUpperCase() },
    select: { id: true, name: true },
  });
  if (!group) {
    return NextResponse.json({ error: "invalid_code" }, { status: 404 });
  }

  const existing = await prisma.membership.findUnique({
    where: { groupId_studentId: { groupId: group.id, studentId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "already_member" }, { status: 409 });
  }

  await prisma.membership.create({
    data: { groupId: group.id, studentId: user.id },
  });
  return NextResponse.json({ ok: true, groupName: group.name });
}
