import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { setSessionCookie } from "@/lib/auth";
import { googleEnabled, oauthUpsert, siteOrigin } from "@/lib/oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const origin = siteOrigin(req);
  const fail = (e: string) => NextResponse.redirect(`${origin}/login?error=${e}`);

  if (!googleEnabled()) return fail("google_disabled");

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "";
  const [role, nonce] = state.split(".");

  const cookieStore = await cookies();
  const expected = cookieStore.get("oauth_state")?.value;
  cookieStore.delete("oauth_state");
  if (!code || !nonce || nonce !== expected) return fail("oauth_state");

  try {
    // 1. Exchange the code for tokens.
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) return fail("oauth_token");

    // 2. Fetch the user's profile.
    const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const info = await infoRes.json();
    if (!info.sub || !info.email) return fail("oauth_profile");

    // 3. Find or create the user and start a session.
    const user = await oauthUpsert({
      provider: "google",
      providerId: String(info.sub),
      email: String(info.email).toLowerCase(),
      name: info.name || info.email,
      role,
    });
    await setSessionCookie(user);

    const dest = user.role === "student" ? "/demo/student" : "/demo/teacher";
    return NextResponse.redirect(`${origin}${dest}`);
  } catch {
    return fail("oauth_failed");
  }
}
