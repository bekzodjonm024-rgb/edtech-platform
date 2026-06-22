import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser, hashPassword, verifyPassword } from "@/lib/auth";
import { parseJson } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  currentPassword: z.string().max(200).optional(),
  newPassword: z.string().max(200).optional(),
});

// Change (or, for OAuth-only accounts, set for the first time) the password.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const limited = await rateLimitResponse(req, "auth:password", { limit: 10, windowMs: 60_000, id: user.id });
  if (limited) return limited;

  const { data, error } = await parseJson(req, schema);
  if (error) return error;
  const { currentPassword, newPassword } = data;
  const next = String(newPassword ?? "");
  if (next.length < 6) {
    return NextResponse.json({ error: "password_too_short" }, { status: 400 });
  }

  const record = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });
  if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // If the account already has a password, the current one must match.
  if (record.password) {
    const ok = await verifyPassword(String(currentPassword ?? ""), record.password);
    if (!ok) return NextResponse.json({ error: "wrong_password" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(next) },
  });

  return NextResponse.json({ ok: true, hadPassword: Boolean(record.password) });
}
