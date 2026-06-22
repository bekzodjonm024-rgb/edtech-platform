import { NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const QUIZ_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          q: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "integer" },
        },
        required: ["q", "options", "answer"],
      },
    },
  },
  required: ["questions"],
} as const;

export async function POST(req: Request) {
  if (!hasApiKey()) {
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  const { topic, subject, count, language } = await req.json();
  if (!topic) {
    return NextResponse.json({ error: "missing_topic" }, { status: 400 });
  }

  const lang = LANGUAGE_NAMES[language as string] || "Uzbek";
  const n = Math.min(Math.max(Number(count) || 5, 3), 10);

  try {
    type CreateParams = Parameters<ReturnType<typeof getClient>["messages"]["create"]>[0];
    const params: CreateParams = {
      model: MODEL,
      max_tokens: 3000,
      system:
        "You are a university examiner who writes accurate multiple-choice questions. " +
        `Write everything in ${lang}. Each question has exactly 4 options and one correct answer.`,
      messages: [
        {
          role: "user",
          content:
            `Write ${n} multiple-choice questions for a university course.\n` +
            `Topic: ${topic}\n` +
            `Course / subject: ${subject ?? "General"}\n` +
            `Each question: a clear stem ("q"), an "options" array of exactly 4 distinct ` +
            `choices, and "answer" as the 0-based index of the correct option.`,
        },
      ],
    };
    (params as unknown as Record<string, unknown>).output_config = {
      effort: "low",
      format: { type: "json_schema", schema: QUIZ_SCHEMA },
    };

    const raw = await getClient().messages.create(params);
    const response = raw as unknown as {
      content: Array<{ type: string; text?: string }>;
    };
    const textBlock = response.content.find((b) => b.type === "text");
    const parsed = JSON.parse(textBlock?.text ?? "{}");

    // Sanitise answer indexes.
    if (Array.isArray(parsed.questions)) {
      parsed.questions = parsed.questions
        .filter((q: { options?: unknown[] }) => Array.isArray(q.options) && q.options.length >= 2)
        .map((q: { q: string; options: string[]; answer: number }) => ({
          q: q.q,
          options: q.options.slice(0, 4),
          answer: Math.min(Math.max(Number(q.answer) || 0, 0), Math.min(q.options.length, 4) - 1),
        }));
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-quiz error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
