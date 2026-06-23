import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

// One-time route: GET /api/admin/setup?secret=ADMIN_SETUP_SECRET
// Sets ADMIN_EMAIL user's role to "admin". Call once, then keep the secret safe.
export async function GET(req: Request) {
  const secret = process.env.ADMIN_SETUP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "ADMIN_SETUP_SECRET env var not set" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    return NextResponse.json({ error: "ADMIN_EMAIL env var not set" }, { status: 503 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({ ok: true, user });
}
