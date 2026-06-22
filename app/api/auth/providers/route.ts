import { NextResponse } from "next/server";
import { googleEnabled, telegramEnabled } from "@/lib/oauth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    google: googleEnabled(),
    telegram: telegramEnabled(),
    telegramBot: process.env.TELEGRAM_BOT_USERNAME || null,
  });
}
