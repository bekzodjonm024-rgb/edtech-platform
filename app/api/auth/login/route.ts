import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { parseJson } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Loose on purpose: we look the address up rather than validate its format, and
// never reveal which field was wrong (always "invalid_credentials").
const schema = z.object({
  email: z.string().trim().toLowerCase().min(1).max(254),
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "auth:login", { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const { data, error } = await parseJson(req, schema);
  if (error) return error;

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !user.password || !(await verifyPassword(data.password, user.password))) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
  await setSessionCookie(safe);
  return NextResponse.json({ user: safe });
}
