import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { parseJson } from "@/lib/validation";
import { rateLimitResponse } from "@/lib/rate-limit";
import { getClient, hasApiKey, MODEL, LANGUAGE_NAMES } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

const FEEDBACK_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    strengths: { type: "array", items: { type: "string" } },
    improvements: { type: "array", items: { type: "string" } },
    detailed: { type: "string" },
    score: { type: "integer" }, // 0-5
  },
  required: ["strengths", "improvements", "detailed", "score"],
} as const;

type EssayData = { prompt?: string; rubric?: string[] };

const bodySchema = z.object({
  assignmentId: z.string().min(1).optional(),
  content: z.string().max(20000).optional(),
  language: z.string().max(10).optional(),
});

async function grade(
  topic: string,
  essay: EssayData,
  answer: string,
  language: string
) {
  const lang = LANGUAGE_NAMES[language] || "Uzbek";
  type CreateParams = Parameters<ReturnType<typeof getClient>["messages"]["create"]>[0];
  const params: CreateParams = {
    model: MODEL,
    max_tokens: 1200,
    system:
      "You are a fair, encouraging university instructor grading a student essay. " +
      `Write all feedback in ${lang}. Be specific and constructive; never harsh. ` +
      "Give a holistic score from 0 to 5 (5 = excellent).",
    messages: [
      {
        role: "user",
        content:
          `Grade this student essay.\n\n` +
          `Topic: ${topic}\n` +
          `Essay prompt: ${essay.prompt ?? topic}\n` +
          `Rubric: ${(essay.rubric ?? []).join("; ") || "general quality, clarity, argument"}\n\n` +
          `Student answer:\n"""${answer.slice(0, 6000)}"""\n\n` +
          `Return "strengths" (2-3 points), "improvements" (2-3 points), ` +
          `"detailed" (a short paragraph), and "score" (0-5).`,
      },
    ],
  };
  (params as unknown as Record<string, unknown>).output_config = {
    effort: "low",
    format: { type: "json_schema", schema: FEEDBACK_SCHEMA },
  };

  const raw = await getClient().messages.create(params);
  const response = raw as unknown as { content: Array<{ type: string; text?: string }> };
  const textBlock = response.content.find((b) => b.type === "text");
  const parsed = JSON.parse(textBlock?.text ?? "{}");
  const score = Math.max(0, Math.min(5, Math.round(Number(parsed.score) || 0)));
  return {
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
    detailed: String(parsed.detailed ?? ""),
    score,
  };
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "student") {
    return NextResponse.json({ error: "student_only" }, { status: 403 });
  }

  const limited = await rateLimitResponse(req, "ai:essay-grade", { limit: 20, windowMs: 60_000, id: user.id });
  if (limited) return limited;

  const { data, error } = await parseJson(req, bodySchema);
  if (error) return error;
  const { assignmentId, content, language } = data;
  if (!assignmentId || !content || !String(content).trim()) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: {
      id: true,
      group: { select: { members: { where: { studentId: user.id }, select: { id: true } } } },
      material: { select: { kind: true, topic: true, data: true } },
    },
  });
  if (!assignment) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (assignment.group.members.length === 0) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (assignment.material.kind !== "essay") {
    return NextResponse.json({ error: "not_an_essay" }, { status: 400 });
  }

  let essayData: EssayData = {};
  try {
    essayData = JSON.parse(assignment.material.data) as EssayData;
  } catch {
    essayData = {};
  }

  const answer = String(content);
  let feedback: {
    strengths: string[];
    improvements: string[];
    detailed: string;
    score: number;
    pending?: boolean;
  };
  let score100 = 0;
  let pointsOf5 = 0;

  if (hasApiKey()) {
    try {
      const graded = await grade(
        assignment.material.topic,
        essayData,
        answer,
        String(language || "uz")
      );
      feedback = graded;
      pointsOf5 = graded.score;
      score100 = graded.score * 20;
    } catch (err) {
      console.error("essay grading error:", err);
      feedback = {
        strengths: [],
        improvements: [],
        detailed: "AI baholash hozircha mavjud emas — o'qituvchi qo'lda tekshiradi.",
        score: 0,
        pending: true,
      };
    }
  } else {
    feedback = {
      strengths: [],
      improvements: [],
      detailed: "AI baholash hozircha mavjud emas — o'qituvchi qo'lda tekshiradi.",
      score: 0,
      pending: true,
    };
  }

  await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId: user.id } },
    create: {
      assignmentId,
      studentId: user.id,
      score: score100,
      correct: pointsOf5,
      total: 5,
      content: answer,
      feedback: JSON.stringify(feedback),
    },
    update: {
      score: score100,
      correct: pointsOf5,
      total: 5,
      content: answer,
      feedback: JSON.stringify(feedback),
    },
  });

  return NextResponse.json({ feedback, score: score100 });
}
