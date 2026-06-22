import { NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  const { topic, subject, language } = await req.json();
  if (!topic) {
    return NextResponse.json({ error: "missing_topic" }, { status: 400 });
  }

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
