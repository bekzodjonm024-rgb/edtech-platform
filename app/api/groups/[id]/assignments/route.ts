import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

async function access(groupId: string, userId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: {
      teacherId: true,
      members: { where: { studentId: userId }, select: { id: true } },
    },
  });
  if (!group) return { ok: false as const };
  return {
    ok: true as const,
    isOwner: group.teacherId === userId,
    isMember: group.members.length > 0,
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const a = await access(id, user.id);
  if (!a.ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!a.isOwner && !a.isMember) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const assignments = await prisma.assignment.findMany({
    where: { groupId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      dueAt: true,
      material: { select: { id: true, kind: true, topic: true, subject: true, data: true } },
    },
  });
  return NextResponse.json({ assignments });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const a = await access(id, user.id);
  if (!a.ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!a.isOwner) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { materialId, dueAt } = await req.json();
  if (!materialId) return NextResponse.json({ error: "missing_material" }, { status: 400 });
  let due: Date | null = null;
  if (dueAt) {
    const d = new Date(dueAt);
    if (!isNaN(d.getTime())) due = d;
  }

  // The material must belong to this teacher.
  const material = await prisma.material.findFirst({
    where: { id: materialId, userId: user.id },
    select: { id: true, topic: true, kind: true },
  });
  if (!material) return NextResponse.json({ error: "material_not_found" }, { status: 404 });

  const existing = await prisma.assignment.findUnique({
    where: { groupId_materialId: { groupId: id, materialId } },
  });
  if (existing) return NextResponse.json({ error: "already_assigned" }, { status: 409 });

  const group = await prisma.group.findUnique({
    where: { id },
    select: { name: true, members: { select: { studentId: true } } },
  });

  const assignment = await prisma.assignment.create({ data: { groupId: id, materialId, dueAt: due } });

  // Notify all group members about the new assignment.
  if (group && group.members.length > 0) {
    const kindLabel = material.kind === "quiz" ? "Test" : material.kind === "essay" ? "Uy vazifasi" : "Taqdimot";
    await prisma.notification.createMany({
      data: group.members.map((m) => ({
        userId: m.studentId,
        kind: "new_assignment",
        title: `Yangi topshiriq: ${kindLabel}`,
        body: material.topic,
        href: material.kind === "quiz"
          ? `/demo/quiz/${assignment.id}`
          : material.kind === "essay"
          ? `/demo/essay/${assignment.id}`
          : `/demo/view/${assignment.id}`,
      })),
    });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const a = await access(id, user.id);
  if (!a.ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!a.isOwner) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { assignmentId } = await req.json().catch(() => ({}));
  if (assignmentId) {
    await prisma.assignment.deleteMany({ where: { id: assignmentId, groupId: id } });
  }
  return NextResponse.json({ ok: true });
}
