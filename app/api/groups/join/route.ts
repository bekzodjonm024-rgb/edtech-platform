import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { parseJson } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({ code: z.string().max(40).optional() });

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "student_only" }, { status: 403 });
  }

  const limited = rateLimitResponse(req, "groups:join", { limit: 20, windowMs: 60_000, id: user.id });
  if (limited) return limited;

  const { data, error } = await parseJson(req, schema);
  if (error) return error;
  const code = String(data.code ?? "").trim();
  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const group = await prisma.group.findUnique({
    where: { code: code.toUpperCase() },
    select: { id: true, name: true },
  });
  if (!group) {
    return NextResponse.json({ error: "invalid_code" }, { status: 404 });
  }

  const existing = await prisma.membership.findUnique({
    where: { groupId_studentId: { groupId: group.id, studentId: user.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "already_member" }, { status: 409 });
  }

  await prisma.membership.create({
    data: { groupId: group.id, studentId: user.id },
  });
  return NextResponse.json({ ok: true, groupName: group.name });
}
