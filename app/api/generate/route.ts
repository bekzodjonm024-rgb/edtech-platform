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
  grade: z.union([z.string(), z.number()]).optional(),
  subject: z.string().max(200).optional(),
  language: z.string().max(10).optional(),
});

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
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const limited = await rateLimitResponse(req, "ai:generate", { limit: 15, windowMs: 60_000, id: user.id });
  if (limited) return limited;

  if (!hasApiKey()) {
    // No key configured — let the client fall back to its local mock.
    return NextResponse.json({ error: "no_api_key" }, { status: 503 });
  }

  const { data, error } = await parseJson(req, schema);
  if (error) return error;
  const { topic, grade, subject, language } = data;

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
