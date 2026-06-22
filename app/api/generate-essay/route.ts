import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { parseJson } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";
import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  topic: z.string().trim().min(1).max(300),
  subject: z.string().max(200).optional(),
  language: z.string().max(10).optional(),
});

const ESSAY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    prompt: { type: "string" },
    guidance: { type: "string" },
    expectedLength: { type: "string" },
    rubric: { type: "array", items: { type: "string" } },
  },
  required: ["prompt", "guidance", "expectedLength", "rubric"],
} as const;

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const limited = rateLimitResponse(req, "ai:generate-essay", { limit: 15, windowMs: 60_000, id: user.id });
  if (limited) return limited;

  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  const { data, error } = await parseJson(req, schema);
  if (error) return error;
  const { topic, subject, language } = data;

  const lang = LANGUAGE_NAMES[language as string] || "Uzbek";

  try {
    type CreateParams = Parameters<ReturnType<typeof getClient>["messages"]["create"]>[0];
    const params: CreateParams = {
      model: MODEL,
      max_tokens: 1500,
      system:
        "You are a university instructor designing a written essay assignment. " +
        `Write everything in ${lang}. Produce one focused, thought-provoking essay prompt ` +
        "that asks students to analyse and argue, not merely recall facts.",
      messages: [
        {
          role: "user",
          content:
            `Design a written essay assignment for a university course.\n` +
            `Topic: ${topic}\n` +
            `Course / subject: ${subject ?? "General"}\n` +
            `Return: "prompt" (the essay question/task), "guidance" (2-3 sentences of advice ` +
            `for the student), "expectedLength" (e.g. "500-700 words"), and "rubric" ` +
            `(3-5 concise grading criteria).`,
        },
      ],
    };
    (params as unknown as Record<string, unknown>).output_config = {
      effort: "low",
      format: { type: "json_schema", schema: ESSAY_SCHEMA },
    };

    const raw = await getClient().messages.create(params);
    const response = raw as unknown as {
      content: Array<{ type: string; text?: string }>;
    };
    const textBlock = response.content.find((b) => b.type === "text");
    const parsed = JSON.parse(textBlock?.text ?? "{}");

    if (!Array.isArray(parsed.rubric)) parsed.rubric = [];
    parsed.rubric = parsed.rubric.slice(0, 6).map((r: unknown) => String(r));

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-essay error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
