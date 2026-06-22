import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { telegramEnabled, siteOrigin } from "@/lib/oauth";

export const runtime = "nodejs";

// Step 1: create a pending login and send the user to the bot with the token.
export async function GET(req: Request) {
  const origin = siteOrigin(req);
  if (!telegramEnabled()) {
    return NextResponse.redirect(`${origin}/login?error=telegram_disabled`);
  }

  const url = new URL(req.url);
  const role = url.searchParams.get("role") === "teacher" ? "teacher" : "student";
  const token = randomBytes(24).toString("hex");

  await prisma.telegramLogin.create({ data: { token, role } });

  (await cookies()).set("tg_login", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  const bot = process.env.TELEGRAM_BOT_USERNAME!;
  return NextResponse.redirect(`https://t.me/${bot}?start=${token}`);
}
