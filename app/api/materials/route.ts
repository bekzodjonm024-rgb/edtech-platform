import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const materials = await prisma.material.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, kind: true, topic: true, subject: true, createdAt: true, data: true },
  });
  return NextResponse.json({ materials });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { kind, topic, subject, data } = await req.json();
  if (!kind || !topic || data == null) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const material = await prisma.material.create({
    data: {
      userId: user.id,
      kind: String(kind),
      topic: String(topic),
      subject: subject ? String(subject) : null,
      data: typeof data === "string" ? data : JSON.stringify(data),
    },
  });
  return NextResponse.json({ id: material.id });
}
