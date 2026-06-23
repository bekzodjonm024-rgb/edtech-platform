import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const groups = await prisma.group.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      code: true,
      createdAt: true,
      teacher: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true, assignments: true } },
    },
  });

  return NextResponse.json({ groups });
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

  await prisma.group.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
