import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { oauthUpsert } from "@/lib/oauth";

export const runtime = "nodejs";

// Telegram calls this when the user presses Start in the bot.
export async function POST(req: Request) {
  // Optional shared-secret check.
  const secret = req.headers.get("x-telegram-bot-api-secret-token");
  if (process.env.TELEGRAM_WEBHOOK_SECRET && secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true });
  }

  let update: { message?: { text?: string; from?: { id: number; first_name?: string; last_name?: string } } };
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = update.message;
  if (msg?.text?.startsWith("/start") && msg.from) {
    const token = msg.text.trim().split(/\s+/)[1];
    if (token) {
      const login = await prisma.telegramLogin.findUnique({ where: { token } });
      // Only authenticate fresh, unused tokens (< 10 min old).
      const fresh = login && !login.authedAt && Date.now() - login.createdAt.getTime() < 600_000;
      if (fresh) {
        const from = msg.from;
        const name =
          [from.first_name, from.last_name].filter(Boolean).join(" ") || `tg_${from.id}`;
        const user = await oauthUpsert({
          provider: "telegram",
          providerId: String(from.id),
          email: `tg_${from.id}@telegram.local`,
          name,
          role: login!.role,
        });
        await prisma.telegramLogin.update({
          where: { token },
          data: { tgId: String(from.id), userId: user.id, authedAt: new Date() },
        });

        // Reply with a one-tap button back to the site.
        const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: from.id,
            text: "✅ Tasdiqlandi! Saytga qaytish uchun tugmani bosing:",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔙 Saytga qaytish", url: `${origin}/api/auth/telegram/complete?token=${token}` }],
              ],
            },
          }),
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ ok: true });
}
