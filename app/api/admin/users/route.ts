import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || undefined;
  const search = searchParams.get("search") || undefined;

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      provider: true,
      createdAt: true,
      _count: { select: { materials: true, ownedGroups: true, memberships: true, submissions: true } },
    },
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const { error, user: admin } = await requireAdmin();
  if (error) return error;

  const { id, role } = await req.json();
  if (!id || !role) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  if (!["teacher", "student", "admin"].includes(role)) {
    return NextResponse.json({ error: "invalid_role" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  // Re-sign session if admin changed their own role (would break access).
  void admin; // admin's own session cookie is not re-signed here intentionally.

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(req: Request) {
  const { error, user: admin } = await requireAdmin();
  if (error) return error;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  if (id === admin!.id) {
    return NextResponse.json({ error: "cannot_delete_self" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
