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
  const group = await prisma.group.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      subject: true,
      code: true,
      teacherId: true,
      members: {
        orderBy: { joinedAt: "asc" },
        select: {
          joinedAt: true,
          student: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
  if (!group) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Only the owning teacher (or a member) may view.
  const isOwner = group.teacherId === user.id;
  const isMember = group.members.some((m) => m.student.id === user.id);
  if (!isOwner && !isMember) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: group.id,
    name: group.name,
    subject: group.subject,
    code: isOwner ? group.code : undefined,
    isOwner,
    members: group.members.map((m) => ({
      id: m.student.id,
      name: m.student.name,
      email: isOwner ? m.student.email : undefined,
      joinedAt: m.joinedAt,
    })),
  });
}

// Teacher removes a student from the group.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const { studentId } = await req.json().catch(() => ({}));

  const group = await prisma.group.findUnique({
    where: { id },
    select: { teacherId: true },
  });
  if (!group) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (group.teacherId !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (studentId) {
    await prisma.membership.deleteMany({ where: { groupId: id, studentId } });
  } else {
    // No studentId → delete the whole group.
    await prisma.group.delete({ where: { id } });
  }
  return NextResponse.json({ ok: true });
}
