import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { parseJson, emailSchema } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: emailSchema,
  // Presence + max here; the legacy "weak_password" (<6) check stays below so the
  // register page can keep showing its specific message.
  password: z.string().min(1).max(200),
  role: z.enum(["student", "teacher"]).optional(),
});

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "auth:register", { limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const { data, error } = await parseJson(req, schema);
  if (error) return error;

  if (data.password.length < 6) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }

  const normalizedRole = data.role === "student" ? "student" : "teacher";
  const normalizedEmail = data.email; // already trimmed + lowercased by the schema

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "email_taken" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: normalizedEmail,
      role: normalizedRole,
      password: await hashPassword(data.password),
    },
  });

  const safe = { id: user.id, email: user.email, name: user.name, role: user.role };
  await setSessionCookie(safe);
  return NextResponse.json({ user: safe });
}
