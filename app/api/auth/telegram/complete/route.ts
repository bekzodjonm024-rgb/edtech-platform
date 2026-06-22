import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";
import { siteOrigin } from "@/lib/oauth";

export const runtime = "nodejs";

// Step 3: the user returns from the bot; finalise the session in the browser.
export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const fail = (e: string) => NextResponse.redirect(`${origin}/login?error=${e}`);

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return fail("tg_notoken");

  const login = await prisma.telegramLogin.findUnique({ where: { token } });
  if (!login || !login.authedAt || login.consumed || !login.userId) {
    return fail("tg_pending");
  }

  const user = await prisma.user.findUnique({ where: { id: login.userId } });
  if (!user) return fail("tg_nouser");

  await setSessionCookie({ id: user.id, email: user.email, name: user.name, role: user.role });
  await prisma.telegramLogin.update({ where: { token }, data: { consumed: true } });
  (await cookies()).delete("tg_login");

  const dest = user.role === "student" ? "/demo/student" : "/demo/teacher";
  return NextResponse.redirect(`${origin}${dest}`);
}
