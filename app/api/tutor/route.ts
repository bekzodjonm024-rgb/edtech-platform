import { getSessionUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMsg = { role: "user" | "ai"; text: string };

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  // This route streams text/plain, so keep 429 in the same shape (not JSON).
  const rl = rateLimit(`ai:tutor:${user.id}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return new Response("rate_limited", {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfter) },
    });
  }

  if (!hasApiKey()) {
    return new Response("no_api_key", { status: 503 });
  }

  let payload: { messages?: ChatMsg[]; language?: string };
  try {
    payload = (await req.json()) as { messages?: ChatMsg[]; language?: string };
  } catch {
    return new Response("invalid_json", { status: 400 });
  }
  const { messages, language } = payload;
  const lang = LANGUAGE_NAMES[language as string] || "Uzbek";

  const apiMessages = (messages || [])
    .filter((m) => m.text?.trim())
    .map((m) => ({
      role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
      content: m.text,
    }));

  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system:
      "You are EduAI Tutor, a knowledgeable, patient tutor for university students. " +
      `Always answer in ${lang}. Explain clearly with academic accuracy, use short paragraphs, ` +
      "and give a concrete example when helpful. Keep answers focused.",
    messages: apiMessages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("tutor stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
