import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }
  const normalizedRole = role === "student" ? "student" : "teacher";
  const normalizedEmail = String(email).trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: String(name).trim(),
      email: normalizedEmail,
      role: normalizedRole,
      password: await hashPassword(String(password)),
    },
  });

  const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
  await setSessionCookie(safe);
  return NextResponse.json({ user: safe });
}
