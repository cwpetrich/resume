import { test } from "node:test";
import assert from "node:assert/strict";
import { applyPlan, parsePlan, buildPrompt, type LlmPlan } from "./tailorPlan";
import type { ResumeData } from "./data";

function makeData(): ResumeData {
  return {
    profile: {
      name: "Jane Doe",
      username: "jane",
      host: "example.com",
      title: "Engineer",
      tagline: "Generalist engineer.",
      location: "Remote",
      email: "jane@example.com",
      about: ["Paragraph one."],
      stats: [],
    },
    socials: [],
    experience: [
      {
        company: "Acme",
        role: "Senior Engineer",
        period: "2022 — Present",
        location: "Remote",
        summary: "Built things.",
        highlights: ["Did A", "Did B", "Did C"],
        stack: ["TypeScript"],
      },
      {
        company: "Globex",
        role: "Engineer",
        period: "2019 — 2022",
        location: "Remote",
        summary: "Built other things.",
        highlights: ["Did D", "Did E"],
        stack: ["C#"],
      },
    ],
    skills: [
      { label: "Languages", items: ["TypeScript", "C#"] },
      { label: "Infra", items: ["Docker"] },
    ],
    projects: [],
    education: [],
  };
}

test("parsePlan parses clean JSON", () => {
  const plan = parsePlan('{"summary":"s","skills_order":["Languages"],"roles":[]}');
  assert.equal(plan.summary, "s");
  assert.deepEqual(plan.skills_order, ["Languages"]);
});

test("parsePlan strips markdown code fences", () => {
  const raw = '```json\n{"summary":"s","skills_order":[],"roles":[]}\n```';
  const plan = parsePlan(raw);
  assert.equal(plan.summary, "s");
});

test("parsePlan rejects invalid JSON", () => {
  assert.throws(() => parsePlan("not json"), /did not return valid JSON/);
});

test("parsePlan rejects well-formed JSON missing required fields", () => {
  assert.throws(() => parsePlan('{"summary":"s"}'), /Malformed tailoring response/);
});

test("applyPlan never fabricates: unknown company/role pairs are ignored", () => {
  const data = makeData();
  const plan: LlmPlan = {
    summary: "Tailored summary.",
    skills_order: [],
    roles: [{ company: "Nonexistent Co", role: "Ghost Role", highlight_order: [0] }],
  };
  const result = applyPlan(data, plan);
  // Both real jobs must still be present even though the plan referenced neither.
  assert.equal(result.experience.length, 2);
  assert.ok(result.experience.some((j) => j.company === "Acme"));
  assert.ok(result.experience.some((j) => j.company === "Globex"));
});

test("applyPlan never drops a real job the model omitted from its plan", () => {
  const data = makeData();
  const plan: LlmPlan = {
    summary: "Tailored summary.",
    skills_order: ["Languages"],
    roles: [{ company: "Acme", role: "Senior Engineer", highlight_order: [1] }],
  };
  const result = applyPlan(data, plan);
  assert.equal(result.experience.length, 2);
  assert.equal(result.experience[0].company, "Acme");
  assert.equal(result.experience[1].company, "Globex");
  // Globex wasn't mentioned, so it keeps all its original highlights verbatim.
  assert.deepEqual(result.experience[1].highlights, ["Did D", "Did E"]);
});

test("applyPlan selects/reorders only real highlight text by index", () => {
  const data = makeData();
  const plan: LlmPlan = {
    summary: "s",
    skills_order: [],
    roles: [{ company: "Acme", role: "Senior Engineer", highlight_order: [2, 0] }],
  };
  const result = applyPlan(data, plan);
  const acme = result.experience.find((j) => j.company === "Acme")!;
  assert.deepEqual(acme.highlights, ["Did C", "Did A"]);
});

test("applyPlan ignores out-of-range or invented highlight indices", () => {
  const data = makeData();
  const plan: LlmPlan = {
    summary: "s",
    skills_order: [],
    roles: [{ company: "Acme", role: "Senior Engineer", highlight_order: [99, -1, 1.5] }],
  };
  const result = applyPlan(data, plan);
  const acme = result.experience.find((j) => j.company === "Acme")!;
  // No valid indices survived, so it falls back to the full original list.
  assert.deepEqual(acme.highlights, ["Did A", "Did B", "Did C"]);
});

test("applyPlan never touches company/role/period/location/stack", () => {
  const data = makeData();
  const plan: LlmPlan = {
    summary: "s",
    skills_order: [],
    roles: [{ company: "Acme", role: "Senior Engineer", highlight_order: [0] }],
  };
  const result = applyPlan(data, plan);
  const acme = result.experience.find((j) => j.company === "Acme")!;
  assert.equal(acme.period, "2022 — Present");
  assert.equal(acme.location, "Remote");
  assert.deepEqual(acme.stack, ["TypeScript"]);
});

test("applyPlan reorders skill groups but never alters their items", () => {
  const data = makeData();
  const plan: LlmPlan = {
    summary: "s",
    skills_order: ["Infra", "made-up-label"],
    roles: [],
  };
  const result = applyPlan(data, plan);
  assert.deepEqual(
    result.skills.map((g) => g.label),
    ["Infra", "Languages"], // Infra first (as planned), Languages appended (plan omitted it)
  );
  assert.deepEqual(result.skills[0].items, ["Docker"]);
  assert.deepEqual(result.skills[1].items, ["TypeScript", "C#"]);
});

test("applyPlan falls back to the profile tagline when summary is blank", () => {
  const data = makeData();
  const plan: LlmPlan = { summary: "   ", skills_order: [], roles: [] };
  const result = applyPlan(data, plan);
  assert.equal(result.summary, data.profile.tagline);
});

test("buildPrompt embeds the job description and every real highlight index", () => {
  const data = makeData();
  const prompt = buildPrompt(data, "We need a TypeScript engineer.");
  assert.ok(prompt.includes("We need a TypeScript engineer."));
  assert.ok(prompt.includes("[0] Did A"));
  assert.ok(prompt.includes("[0] Did D"));
  assert.ok(prompt.includes("never invent"));
});
