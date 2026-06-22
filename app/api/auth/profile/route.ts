import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

// Account meta the settings page needs (whether a password is set, provider).
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true, provider: true, email: true, name: true },
  });
  if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    name: record.name,
    email: record.email,
    provider: record.provider,
    hasPassword: Boolean(record.password),
  });
}

// Update the signed-in user's display name and refresh the session cookie
// so the new name shows up everywhere immediately.
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const trimmed = String(name ?? "").trim();
  if (trimmed.length < 2) {
    return NextResponse.json({ error: "name_too_short" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: trimmed },
    select: { id: true, email: true, name: true, role: true },
  });

  await setSessionCookie(updated);
  return NextResponse.json({ user: updated });
}
