import { NextResponse } from "next/server";
import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const LESSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    slides: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          subtitle: { type: "string" },
          body: { type: "string" },
          points: { type: "array", items: { type: "string" } },
        },
        required: ["title", "subtitle", "body", "points"],
      },
    },
  },
  required: ["slides"],
} as const;

export async function POST(req: Request) {
  if (!hasApiKey()) {
    // No key configured — let the client fall back to its local mock.
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  const { topic, grade, subject, language } = await req.json();
  if (!topic) {
    return NextResponse.json({ error: "missing_topic" }, { status: 400 });
  }

  const lang = LANGUAGE_NAMES[language as string] || "Uzbek";

  try {
    type CreateParams = Parameters<ReturnType<typeof getClient>["messages"]["create"]>[0];
    const params: CreateParams = {
      model: MODEL,
      max_tokens: 3000,
      system:
        "You are an experienced university faculty member who designs concise, accurate " +
        "lecture slides for higher-education courses. " +
        `Write all content in ${lang}. Keep each slide academically rigorous and focused.`,
      messages: [
        {
          role: "user",
          content:
            `Create a 6-slide lecture presentation for a university course.\n` +
            `Topic: ${topic}\n` +
            `Course year: ${grade ?? "2"}\n` +
            `Course / subject: ${subject ?? "General"}\n` +
            `Each slide: a short title, a one-line subtitle, a 1-2 sentence body, ` +
            `and 3-5 key concept points.`,
        },
      ],
    };
    // `output_config` (structured outputs + effort) is newer than the installed SDK types.
    (params as unknown as Record<string, unknown>).output_config = {
      effort: "low",
      format: { type: "json_schema", schema: LESSON_SCHEMA },
    };

    const raw = await getClient().messages.create(params);
    const response = raw as unknown as {
      content: Array<{ type: string; text?: string }>;
    };

    const textBlock = response.content.find((b) => b.type === "text");
    const parsed = JSON.parse(textBlock?.text ?? "{}");
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate error:", err);
    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
