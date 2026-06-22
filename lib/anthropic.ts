import Anthropic from "@anthropic-ai/sdk";

// Server-only. Never import this from a client component.
export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

export function hasApiKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;

export function getClient() {
  if (!client) {
    client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  }
  return client;
}

export const LANGUAGE_NAMES: Record<string, string> = {
  uz: "Uzbek",
  en: "English",
  ru: "Russian",
};
