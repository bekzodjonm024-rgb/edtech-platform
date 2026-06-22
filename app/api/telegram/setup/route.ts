import { NextResponse } from "next/server";

export const runtime = "nodejs";

// One-shot helper to (re)register the Telegram webhook using the bot token
// that already lives in the server env — so the token never has to be pasted
// into a shell or chat. Call after rotating TELEGRAM_BOT_TOKEN + redeploying:
//   GET /api/telegram/setup?secret=<TELEGRAM_WEBHOOK_SECRET>
export async function GET(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (!token || !webhookSecret || !origin) {
    return NextResponse.json(
      { error: "missing_env", need: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBHOOK_SECRET", "NEXT_PUBLIC_SITE_URL"] },
      { status: 503 }
    );
  }

  // Gate behind the shared webhook secret so randoms can't reset the webhook.
  const provided = new URL(req.url).searchParams.get("secret");
  if (provided !== webhookSecret) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const webhookUrl = `${origin}/api/telegram/webhook`;
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: webhookSecret,
      drop_pending_updates: true,
      allowed_updates: ["message"],
    }),
  });
  const result = await res.json().catch(() => ({}));

  // Confirm with getWebhookInfo (does not expose the token).
  const infoRes = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const info = await infoRes.json().catch(() => ({}));

  return NextResponse.json({
    setWebhook: result,
    webhookUrl,
    info: info?.result ?? info,
  });
}
