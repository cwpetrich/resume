import "server-only";
import type { ResumeData, Job, SkillGroup } from "./data";
import { buildPrompt, parsePlan, applyPlan } from "./tailorPlan";

/**
 * Job-application tailoring: given a job posting, ask an LLM to pick and
 * reorder from the candidate's REAL résumé data so the most relevant recent
 * experience and skills surface first — without ever inventing facts.
 *
 * The prompt-building and plan-reconciliation logic (the part that actually
 * guarantees no fabrication) lives in ./tailorPlan, which has no secrets or
 * "server-only" guard and is covered by lib/tailorPlan.test.ts. This file is
 * just the network call + wiring, which needs the real API key and so can't
 * run in a plain test process.
 */

const MODEL = process.env.TAILOR_MODEL || "claude-sonnet-4-5";

export interface TailoredResult {
  summary: string;
  skills: SkillGroup[];
  experience: Job[];
  model: string;
}

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Add it to .env.local to use résumé tailoring.",
    );
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = json.content?.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("Anthropic response had no text content.");
  return text;
}

export async function generateTailoredResume(
  data: ResumeData,
  jobDescription: string,
): Promise<TailoredResult> {
  const prompt = buildPrompt(data, jobDescription);
  const raw = await callClaude(prompt);
  const plan = parsePlan(raw);
  const resolved = applyPlan(data, plan);
  return { ...resolved, model: MODEL };
}
