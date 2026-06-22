import { NextResponse } from "next/server";
import { createHash, createHmac } from "crypto";
import { setSessionCookie } from "@/lib/auth";
import { telegramEnabled, oauthUpsert, siteOrigin } from "@/lib/oauth";

export const runtime = "nodejs";

// Telegram Login Widget redirects here with signed user data.
export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const fail = (e: string) => NextResponse.redirect(`${origin}/login?error=${e}`);

  if (!telegramEnabled()) return fail("telegram_disabled");

  const url = new URL(req.url);
  const q = url.searchParams;
  const hash = q.get("hash");
  if (!hash) return fail("telegram_nohash");

  // Build the data-check-string from Telegram's own fields only (exclude hash + our role).
  const fields = ["auth_date", "first_name", "id", "last_name", "photo_url", "username"];
  const checkString = fields
    .filter((k) => q.get(k) !== null)
    .map((k) => `${k}=${q.get(k)}`)
    .join("\n");

  const secret = createHash("sha256").update(process.env.TELEGRAM_BOT_TOKEN!).digest();
  const computed = createHmac("sha256", secret).update(checkString).digest("hex");
  if (computed !== hash) return fail("telegram_badhash");

  // Reject stale logins (older than 1 day).
  const authDate = Number(q.get("auth_date") || 0);
  if (!authDate || Date.now() / 1000 - authDate > 86400) return fail("telegram_expired");

  try {
    const id = q.get("id")!;
    const name = [q.get("first_name"), q.get("last_name")].filter(Boolean).join(" ") || `tg_${id}`;
    const role = q.get("role") === "teacher" ? "teacher" : "student";

    const user = await oauthUpsert({
      provider: "telegram",
      providerId: id,
      email: `tg_${id}@telegram.local`,
      name,
      role,
    });
    await setSessionCookie(user);

    const dest = user.role === "student" ? "/demo/student" : "/demo/teacher";
    return NextResponse.redirect(`${origin}${dest}`);
  } catch {
    return fail("telegram_failed");
  }
}
