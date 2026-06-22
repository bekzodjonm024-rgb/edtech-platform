import { prisma } from "@/lib/db";
import type { SessionUser } from "@/lib/auth";

export function googleEnabled() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
export function telegramEnabled() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_USERNAME);
}

export function siteOrigin(req: Request) {
  // Prefer an explicit configured URL, else derive from the request.
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

function normalizeRole(role?: string | null) {
  return role === "teacher" ? "teacher" : "student";
}

/**
 * Find or create a user for an OAuth provider, then return the safe session user.
 * Matches first by (provider, providerId), then by email (links the account).
 */
export async function oauthUpsert(opts: {
  provider: "google" | "telegram";
  providerId: string;
  email: string;
  name: string;
  role?: string | null;
}): Promise<SessionUser> {
  const { provider, providerId, email, name } = opts;

  let user = await prisma.user.findFirst({ where: { provider, providerId } });

  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { provider, providerId },
      });
    }
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || email,
        role: normalizeRole(opts.role),
        provider,
        providerId,
        password: null,
      },
    });
  }

  return { id: user.id, email: user.email, name: user.name, role: user.role };
}
