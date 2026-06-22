import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { googleEnabled, siteOrigin } from "@/lib/oauth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const origin = siteOrigin(req);
  if (!googleEnabled()) {
    return NextResponse.redirect(`${origin}/login?error=google_disabled`);
  }

  const url = new URL(req.url);
  const role = url.searchParams.get("role") === "teacher" ? "teacher" : "student";
  const nonce = randomBytes(16).toString("hex");
  const state = `${role}.${nonce}`;

  (await cookies()).set("oauth_state", nonce, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    // No `prompt` → returning, already-signed-in users are redirected
    // straight back without the account chooser (seamless auto-login).
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
