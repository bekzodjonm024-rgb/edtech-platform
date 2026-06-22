import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Durable, cross-instance rate limiter backed by Postgres (fixed window).
 *
 * Why not in-memory: on Vercel each serverless instance has its own memory, so a
 * Map-based limiter doesn't see requests handled by sibling instances and never
 * fires reliably. A shared store (the DB we already have) makes the limit real.
 * It costs one indexed upsert per check — fine for the auth / AI routes it guards.
 *
 * Fails OPEN: if the DB is briefly unavailable we let the request through rather
 * than lock everyone out. Swap to Upstash Redis if DB load ever becomes a concern
 * — the signatures here can stay the same.
 */

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitResult = { ok: boolean; retryAfter: number };

export async function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  const now = Date.now();
  const bucket = Math.floor(now / opts.windowMs);
  const rowKey = `${key}:${bucket}`;
  const expires = new Date((bucket + 1) * opts.windowMs);

  try {
    // Atomic INSERT ... ON CONFLICT DO UPDATE count = count + 1, returning the
    // post-increment count — so concurrent requests can't undercount.
    const row = await prisma.rateLimit.upsert({
      where: { key: rowKey },
      create: { key: rowKey, count: 1, expires },
      update: { count: { increment: 1 } },
    });

    if (row.count > opts.limit) {
      const retryAfter = Math.max(1, Math.ceil((expires.getTime() - now) / 1000));
      return { ok: false, retryAfter };
    }

    // Opportunistic cleanup of expired rows (~1% of allowed requests).
    if (Math.random() < 0.01) {
      prisma.rateLimit
        .deleteMany({ where: { expires: { lt: new Date() } } })
        .catch(() => {});
    }
    return { ok: true, retryAfter: 0 };
  } catch {
    // Fail open — never block legitimate users because the limiter store hiccuped.
    return { ok: true, retryAfter: 0 };
  }
}

/**
 * Returns a ready-to-send 429 NextResponse if the caller is over the limit,
 * otherwise `null`. Keyed by `name` + (`opts.id` ?? client IP) — pass a user id
 * for authenticated routes so the limit follows the account, not the IP.
 */
export async function rateLimitResponse(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number; id?: string },
): Promise<NextResponse | null> {
  const subject = opts.id || clientIp(req);
  const { ok, retryAfter } = await rateLimit(`${name}:${subject}`, opts);
  if (ok) return null;
  return NextResponse.json(
    { error: "rate_limited", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
