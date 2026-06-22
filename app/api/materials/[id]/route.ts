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
  const material = await prisma.material.findUnique({
    where: { id },
    select: { id: true, userId: true, kind: true, topic: true, subject: true, data: true },
  });
  if (!material) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Allowed if owner, or it's assigned to a group the user belongs to.
  let allowed = material.userId === user.id;
  if (!allowed) {
    const viaAssignment = await prisma.assignment.findFirst({
      where: {
        materialId: id,
        group: { members: { some: { studentId: user.id } } },
      },
      select: { id: true },
    });
    allowed = Boolean(viaAssignment);
  }
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  return NextResponse.json({
    id: material.id,
    kind: material.kind,
    topic: material.topic,
    subject: material.subject,
    data: material.data,
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  // Only delete if it belongs to the current user.
  await prisma.material.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
