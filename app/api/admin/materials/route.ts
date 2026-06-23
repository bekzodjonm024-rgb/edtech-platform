import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const materials = await prisma.material.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      kind: true,
      topic: true,
      subject: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { assignments: true } },
    },
  });

  return NextResponse.json({ materials });
}

export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "missing_fields" }, { status: 400 });

  await prisma.material.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
