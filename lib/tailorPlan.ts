import type { ResumeData, Job, SkillGroup } from "./data";

/**
 * Pure planning/reconciliation logic for job-application tailoring — no
 * network calls, no secrets, no "server-only" guard, so it's safely testable
 * and importable from a plain Node test runner.
 *
 * Safety model: the LLM is only ever allowed to (a) reorder skill groups,
 * (b) reorder jobs, (c) select/reorder which of a job's EXISTING highlight
 * strings to show, and (d) write one tailored summary paragraph from the
 * provided facts. It never gets to write new highlight text, change a
 * company/role/period/stack, or add skill items — `applyPlan` below
 * reconciles its output against the real data and drops/falls-back anything
 * that doesn't resolve to something that actually exists.
 */

export interface LlmPlan {
  summary: string;
  skills_order: string[];
  roles: { company: string; role: string; highlight_order: number[] }[];
}

export function buildPrompt(data: ResumeData, jobDescription: string): string {
  const factSheet = {
    profile: { tagline: data.profile.tagline, about: data.profile.about },
    skills: data.skills,
    experience: data.experience.map((j, i) => ({
      index: i,
      company: j.company,
      role: j.role,
      period: j.period,
      location: j.location,
      summary: j.summary,
      stack: j.stack,
      highlights: j.highlights.map((h, hi) => `[${hi}] ${h}`),
    })),
  };

  return `You are tailoring a software engineer's résumé to a specific job posting. Work ONLY from the facts given below — never invent companies, titles, dates, numbers, outcomes, or skills that are not present in the fact sheet. Your job is to select, reorder, and emphasize — not to fabricate.

JOB POSTING:
"""
${jobDescription}
"""

CANDIDATE FACT SHEET (JSON):
${JSON.stringify(factSheet, null, 2)}

Return ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:
{
  "summary": string,
  "skills_order": string[],
  "roles": [
    { "company": string, "role": string, "highlight_order": number[] }
  ]
}

Rules:
- "summary": 3-5 sentences highlighting the candidate's most relevant recent (last few years first) experience for THIS posting, built only from facts above.
- "skills_order": the skill-group "label" values above, reordered most-relevant-to-this-posting first. Only use labels that appear above.
- "roles": include every experience entry above exactly once, reordered most-relevant-first. "company" and "role" must exactly match a pair from the fact sheet.
- "highlight_order": the bracketed indices for that job's highlights, reordered/selected to foreground what matters for this posting. You may drop irrelevant indices, but every number must be one that was shown for that job — do not invent new ones or renumber.`;
}

export function parsePlan(raw: string): LlmPlan {
  const cleaned = raw
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Model did not return valid JSON for the tailoring plan.");
  }
  const p = parsed as Partial<LlmPlan>;
  if (
    typeof p.summary !== "string" ||
    !Array.isArray(p.skills_order) ||
    !Array.isArray(p.roles)
  ) {
    throw new Error("Malformed tailoring response from model.");
  }
  return p as LlmPlan;
}

/** Reconcile the model's plan against the real data: reorder/select only. */
export function applyPlan(
  data: ResumeData,
  plan: LlmPlan,
): { summary: string; skills: SkillGroup[]; experience: Job[] } {
  // Skills: reorder existing groups by label; items are always the real ones.
  const skillByLabel = new Map(data.skills.map((g) => [g.label, g]));
  const seenLabels = new Set<string>();
  const skills: SkillGroup[] = [];
  for (const label of plan.skills_order ?? []) {
    const g = skillByLabel.get(label);
    if (g && !seenLabels.has(label)) {
      skills.push(g);
      seenLabels.add(label);
    }
  }
  for (const g of data.skills) {
    if (!seenLabels.has(g.label)) {
      skills.push(g);
      seenLabels.add(g.label);
    }
  }

  // Experience: reorder existing jobs; select/reorder highlights by validated index only.
  const jobKey = (company: string, role: string) => `${company}::${role}`;
  const jobByKey = new Map(data.experience.map((j) => [jobKey(j.company, j.role), j]));
  const usedKeys = new Set<string>();
  const experience: Job[] = [];
  for (const r of plan.roles ?? []) {
    const key = jobKey(r.company, r.role);
    const job = jobByKey.get(key);
    if (!job || usedKeys.has(key)) continue;
    usedKeys.add(key);
    const validIdx = Array.isArray(r.highlight_order)
      ? r.highlight_order.filter(
          (i): i is number =>
            Number.isInteger(i) && i >= 0 && i < job.highlights.length,
        )
      : [];
    const dedupedIdx = Array.from(new Set(validIdx));
    const highlights =
      dedupedIdx.length > 0 ? dedupedIdx.map((i) => job.highlights[i]) : job.highlights;
    experience.push({ ...job, highlights });
  }
  // Any job the model dropped or mismatched still has to appear — never lose real history.
  for (const job of data.experience) {
    const key = jobKey(job.company, job.role);
    if (!usedKeys.has(key)) {
      usedKeys.add(key);
      experience.push(job);
    }
  }

  const summary = (plan.summary ?? "").trim() || data.profile.tagline;
  return { summary, skills, experience };
}
