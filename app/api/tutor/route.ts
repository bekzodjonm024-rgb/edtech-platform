import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMsg = { role: "user" | "ai"; text: string };

export async function POST(req: Request) {
  if (!hasApiKey()) {
    return new Response("no_api_key", { status: 503 });
  }

  const { messages, language } = (await req.json()) as {
    messages: ChatMsg[];
    language?: string;
  };
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
