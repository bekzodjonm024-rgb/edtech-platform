import { NextResponse } from "next/server";

/**
 * In-memory sliding-window rate limiter.
 *
 * ⚠️ State lives per serverless instance, so on Vercel this is *best-effort*:
 * an attacker spread across many warm instances gets a higher effective limit.
 * It still blunts bursts and brute-force from a single connection and protects
 * the AI routes from runaway cost. When durable, cross-instance limits are
 * needed, swap the store below for Upstash Redis (`@upstash/ratelimit`) — the
 * `rateLimit()` / `rateLimitResponse()` signatures can stay the same.
 */

type Bucket = number[]; // request timestamps (ms), within the current window
const buckets = new Map<string, Bucket>();

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export type RateLimitResult = { ok: boolean; retryAfter: number };

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - opts.windowMs;
  const hits = (buckets.get(key) || []).filter((t) => t > windowStart);

  if (hits.length >= opts.limit) {
    buckets.set(key, hits);
    const retryAfter = Math.max(1, Math.ceil((hits[0]! + opts.windowMs - now) / 1000));
    return { ok: false, retryAfter };
  }

  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) sweep(windowStart);
  return { ok: true, retryAfter: 0 };
}

function sweep(windowStart: number) {
  for (const [k, v] of buckets) {
    const fresh = v.filter((t) => t > windowStart);
    if (fresh.length === 0) buckets.delete(k);
    else buckets.set(k, fresh);
  }
}

/**
 * Returns a ready-to-send 429 NextResponse if the caller is over the limit,
 * otherwise `null`. Keyed by `name` + (`opts.id` ?? client IP) — pass a user id
 * for authenticated routes so the limit follows the account, not the IP.
 */
export function rateLimitResponse(
  req: Request,
  name: string,
  opts: { limit: number; windowMs: number; id?: string },
): NextResponse | null {
  const subject = opts.id || clientIp(req);
  const { ok, retryAfter } = rateLimit(`${name}:${subject}`, opts);
  if (ok) return null;
  return NextResponse.json(
    { error: "rate_limited", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
