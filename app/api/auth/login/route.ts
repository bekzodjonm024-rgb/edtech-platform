import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  });
  if (!user || !user.password || !(await verifyPassword(String(password), user.password))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
  await setSessionCookie(safe);
  return NextResponse.json({ user: safe });
}
