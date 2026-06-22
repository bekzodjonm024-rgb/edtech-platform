import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Safely read + validate a JSON request body against a zod schema.
 * Returns `{ data }` on success, or `{ error }` — a ready-to-send 400 response —
 * when the body isn't JSON or fails validation. Usage:
 *
 *   const { data, error } = await parseJson(req, schema);
 *   if (error) return error;
 */
export type ParseResult<T> =
  | { data: T; error: null }
  | { data: null; error: NextResponse };

export async function parseJson<S extends z.ZodTypeAny>(
  req: Request,
  schema: S,
): Promise<ParseResult<z.infer<S>>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { data: null, error: NextResponse.json({ error: "invalid_json" }, { status: 400 }) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      data: null,
      error: NextResponse.json(
        { error: "invalid_input", details: parsed.error.flatten() },
        { status: 400 },
      ),
    };
  }
  return { data: parsed.data, error: null };
}

// Shared field schemas reused across routes.
export const emailSchema = z.string().trim().toLowerCase().min(3).max(254).email();
export const passwordSchema = z.string().min(6).max(200);
