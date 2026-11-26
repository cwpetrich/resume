"use client";

import { useState, useTransition } from "react";
import type {
  Profile,
  SocialLink,
  Job,
  Highlight,
  HighlightCategory,
  SkillGroup,
  Project,
  SchoolEntry,
} from "@/lib/data";
import { HIGHLIGHT_PROMPTS } from "@/lib/data";
import {
  saveProfileAction,
  saveSocialsAction,
  saveExperienceAction,
  saveSkillsAction,
  saveProjectsAction,
  saveEducationAction,
  generateTailoredResumeAction,
  deleteTailoredResumeAction,
} from "@/app/admin/actions";
import type { TailoredResumeSummary } from "@/lib/resume";
import { TextInput, TextArea, StringList, ListEditor, SectionCard, inputCls } from "./ui";

/* ----------------------------- Profile & contact ----------------------------- */
export function ProfileForm({ initial }: { initial: Profile }) {
  const [p, setP] = useState<Profile>(initial);
  const set = (patch: Partial<Profile>) => setP({ ...p, ...patch });

  return (
    <SectionCard
      id="profile"
      title="Profile & contact"
      hint="Identity shown in the hero, prompt, and meta tags."
      value={p}
      onSave={saveProfileAction}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="name" value={p.name} onChange={(v) => set({ name: v })} />
        <TextInput label="title" value={p.title} onChange={(v) => set({ title: v })} />
        <TextInput
          label="username (shell handle)"
          value={p.username}
          onChange={(v) => set({ username: v })}
        />
        <TextInput
          label="host (your domain)"
          value={p.host}
          onChange={(v) => set({ host: v })}
        />
        <TextInput label="email" value={p.email} onChange={(v) => set({ email: v })} />
        <TextInput
          label="location"
          value={p.location}
          onChange={(v) => set({ location: v })}
        />
      </div>
      <TextArea
        label="tagline"
        value={p.tagline}
        onChange={(v) => set({ tagline: v })}
        rows={2}
      />
      <StringList
        label="about paragraphs"
        values={p.about}
        onChange={(v) => set({ about: v })}
        placeholder="A paragraph about you…"
        multiline
      />
      <div>
        <span className="mb-1 block text-xs text-term-dim">stats</span>
        <ListEditor<{ label: string; value: string }>
          items={p.stats}
          onChange={(stats) => set({ stats })}
          blank={() => ({ label: "", value: "" })}
          addLabel="add stat"
          titleOf={(s) => `${s.value} ${s.label}`.trim()}
          render={(s, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                label="value"
                value={s.value}
                onChange={(v) => update({ value: v })}
              />
              <TextInput
                label="label"
                value={s.label}
                onChange={(v) => update({ label: v })}
              />
            </div>
          )}
        />
      </div>
    </SectionCard>
  );
}

/* ----------------------------------- Socials --------------------------------- */
export function SocialsForm({ initial }: { initial: SocialLink[] }) {
  const [socials, setSocials] = useState<SocialLink[]>(initial);
  return (
    <SectionCard
      id="socials"
      title="Social links"
      hint="Email is managed in Profile; add GitHub, LinkedIn, etc. here."
      value={socials}
      onSave={saveSocialsAction}
    >
      <ListEditor<SocialLink>
        items={socials}
        onChange={setSocials}
        blank={() => ({ label: "", handle: "", href: "" })}
        addLabel="add link"
        titleOf={(s) => s.label}
        render={(s, update) => (
          <div className="grid gap-3 sm:grid-cols-3">
            <TextInput label="label" value={s.label} onChange={(v) => update({ label: v })} />
            <TextInput label="handle" value={s.handle} onChange={(v) => update({ handle: v })} />
            <TextInput label="url" value={s.href} onChange={(v) => update({ href: v })} />
          </div>
        )}
      />
    </SectionCard>
  );
}

/** Per-highlight editor: free-text + optional category, with quick-add
 * buttons for the fixed guided prompts (see HIGHLIGHT_PROMPTS) so building up
 * a richer fact bank per role doesn't require guessing what to write about. */
function HighlightsEditor({
  values,
  onChange,
}: {
  values: Highlight[];
  onChange: (v: Highlight[]) => void;
}) {
  const set = (i: number, patch: Partial<Highlight>) =>
    onChange(values.map((h, j) => (j === i ? { ...h, ...patch } : h)));
  const remove = (i: number) => onChange(values.filter((_, j) => j !== i));
  const add = (category?: HighlightCategory) =>
    onChange([...values, { text: "", category }]);

  return (
    <div>
      <span className="mb-1 block text-xs text-term-dim">highlights</span>
      <div className="space-y-2">
        {values.map((h, i) => {
          const promptFor = HIGHLIGHT_PROMPTS.find((p) => p.category === h.category);
          return (
            <div key={i} className="flex gap-2">
              <select
                value={h.category ?? ""}
                onChange={(e) =>
                  set(i, {
                    category: (e.target.value || undefined) as HighlightCategory | undefined,
                  })
                }
                className="h-fit shrink-0 rounded border border-term-border bg-black/30 px-2 py-2 text-xs text-term-dim outline-none focus:border-term-accent"
                aria-label="category"
              >
                <option value="">— plain</option>
                {HIGHLIGHT_PROMPTS.map((p) => (
                  <option key={p.category} value={p.category}>
                    {p.label}
                  </option>
                ))}
              </select>
              <textarea
                value={h.text}
                rows={2}
                placeholder={promptFor?.prompt ?? "Did X resulting in Y…"}
                onChange={(e) => set(i, { text: e.target.value })}
                className={inputCls + " resize-y"}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="shrink-0 self-start rounded border border-term-border px-2 py-1 text-xs text-term-dim hover:border-red-400 hover:text-red-400"
                aria-label="remove"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {HIGHLIGHT_PROMPTS.map((p) => (
          <button
            key={p.category}
            type="button"
            title={p.prompt}
            onClick={() => add(p.category)}
            className="rounded border border-dashed border-term-border px-2 py-1 text-xs text-term-accent hover:border-term-accent"
          >
            + {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => add()}
          className="rounded border border-dashed border-term-border px-2 py-1 text-xs text-term-dim hover:border-term-accent"
        >
          + plain highlight
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- Experience -------------------------------- */
export function ExperienceForm({ initial }: { initial: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initial);
  return (
    <SectionCard
      id="experience"
      title="Experience"
      hint="Lead bullets with impact; quantify where you can. Use the prompt buttons to build up more detail per role — the job-tailoring tool draws from all of it."
      value={jobs}
      onSave={saveExperienceAction}
    >
      <ListEditor<Job>
        items={jobs}
        onChange={setJobs}
        blank={() => ({
          company: "",
          role: "",
          period: "",
          location: "",
          summary: "",
          highlights: [],
          stack: [],
        })}
        addLabel="add job"
        titleOf={(jb) => [jb.role, jb.company].filter(Boolean).join(" @ ")}
        render={(jb, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="role" value={jb.role} onChange={(v) => update({ role: v })} />
              <TextInput label="company" value={jb.company} onChange={(v) => update({ company: v })} />
              <TextInput label="period" value={jb.period} onChange={(v) => update({ period: v })} />
              <TextInput label="location" value={jb.location} onChange={(v) => update({ location: v })} />
            </div>
            <TextArea
              label="summary"
              value={jb.summary}
              onChange={(v) => update({ summary: v })}
              rows={2}
            />
            <HighlightsEditor
              values={jb.highlights}
              onChange={(highlights) => update({ highlights })}
            />
            <StringList
              label="stack"
              values={jb.stack}
              onChange={(stack) => update({ stack })}
              placeholder="TypeScript"
            />
          </>
        )}
      />
    </SectionCard>
  );
}

/* ----------------------------------- Skills ---------------------------------- */
export function SkillsForm({ initial }: { initial: SkillGroup[] }) {
  const [groups, setGroups] = useState<SkillGroup[]>(initial);
  return (
    <SectionCard
      id="skills"
      title="Skills"
      hint="Group related skills under a heading."
      value={groups}
      onSave={saveSkillsAction}
    >
      <ListEditor<SkillGroup>
        items={groups}
        onChange={setGroups}
        blank={() => ({ label: "", items: [] })}
        addLabel="add group"
        titleOf={(g) => g.label}
        render={(g, update) => (
          <>
            <TextInput label="group label" value={g.label} onChange={(v) => update({ label: v })} />
            <StringList
              label="items"
              values={g.items}
              onChange={(items) => update({ items })}
              placeholder="React"
            />
          </>
        )}
      />
    </SectionCard>
  );
}

/* ---------------------------------- Projects --------------------------------- */
export function ProjectsForm({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initial);
  return (
    <SectionCard
      id="projects"
      title="Projects"
      hint="Showcase notable work. Links are optional."
      value={projects}
      onSave={saveProjectsAction}
    >
      <ListEditor<Project>
        items={projects}
        onChange={setProjects}
        blank={() => ({ name: "", slug: "", description: "", stack: [], href: "", repo: "" })}
        addLabel="add project"
        titleOf={(p) => p.name}
        render={(p, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="name" value={p.name} onChange={(v) => update({ name: v })} />
              <TextInput
                label="slug (terminal dir name)"
                value={p.slug}
                onChange={(v) => update({ slug: v })}
              />
            </div>
            <TextArea
              label="description"
              value={p.description}
              onChange={(v) => update({ description: v })}
              rows={2}
            />
            <StringList
              label="stack"
              values={p.stack}
              onChange={(stack) => update({ stack })}
              placeholder="Next.js"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput
                label="live url (optional)"
                value={p.href ?? ""}
                onChange={(v) => update({ href: v })}
              />
              <TextInput
                label="repo url (optional)"
                value={p.repo ?? ""}
                onChange={(v) => update({ repo: v })}
              />
            </div>
          </>
        )}
      />
    </SectionCard>
  );
}

/* --------------------------------- Education --------------------------------- */
export function EducationForm({ initial }: { initial: SchoolEntry[] }) {
  const [entries, setEntries] = useState<SchoolEntry[]>(initial);
  return (
    <SectionCard
      id="education"
      title="Education"
      value={entries}
      onSave={saveEducationAction}
    >
      <ListEditor<SchoolEntry>
        items={entries}
        onChange={setEntries}
        blank={() => ({ school: "", credential: "", period: "", detail: "" })}
        addLabel="add entry"
        titleOf={(e) => e.credential}
        render={(e, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="credential" value={e.credential} onChange={(v) => update({ credential: v })} />
              <TextInput label="school" value={e.school} onChange={(v) => update({ school: v })} />
              <TextInput label="period" value={e.period} onChange={(v) => update({ period: v })} />
              <TextInput
                label="detail (optional)"
                value={e.detail ?? ""}
                onChange={(v) => update({ detail: v })}
              />
            </div>
          </>
        )}
      />
    </SectionCard>
  );
}

/* --------------------------- Tailor for a job posting ------------------------- */
export function TailorPanel({ initial }: { initial: TailoredResumeSummary[] }) {
  const [label, setLabel] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [saved, setSaved] = useState<TailoredResumeSummary[]>(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    start(async () => {
      const res = await generateTailoredResumeAction(jobDescription, label);
      if (!res.ok || !res.id) {
        setError(res.error || "generation failed");
        return;
      }
      setSaved([
        {
          id: res.id,
          createdAt: new Date().toISOString(),
          label: label.trim() || "Untitled",
          model: "",
        },
        ...saved,
      ]);
      setJobDescription("");
      setLabel("");
    });
  };

  const remove = (id: string) => {
    setSaved(saved.filter((s) => s.id !== id));
    start(async () => {
      await deleteTailoredResumeAction(id);
    });
  };

  return (
    <section
      id="tailor"
      className="scroll-mt-20 rounded-lg border border-term-border bg-term-panel p-5"
    >
      <div className="mb-4">
        <h2 className="text-sm font-bold text-term-fg">Tailor résumé to a job</h2>
        <p className="text-xs text-term-dim">
          Paste a job posting. An LLM reorders your real skills and experience
          and selects which highlights to foreground for this posting — it
          never invents facts. Each result is saved below.
        </p>
      </div>
      <div className="space-y-4">
        <TextInput
          label="label (e.g. company — role)"
          value={label}
          onChange={setLabel}
        />
        <TextArea
          label="job description"
          value={jobDescription}
          onChange={setJobDescription}
          rows={8}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="button"
          onClick={generate}
          disabled={pending || !jobDescription.trim()}
          className="rounded border border-term-accent bg-term-accent/10 px-4 py-1.5 text-sm font-semibold text-term-accent transition-colors hover:bg-term-accent/20 disabled:opacity-50"
        >
          {pending ? "working…" : "generate tailored résumé"}
        </button>
      </div>

      {saved.length > 0 && (
        <div className="mt-6 space-y-2 border-t border-term-border pt-4">
          <span className="mb-1 block text-xs text-term-dim">saved versions</span>
          {saved.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 rounded border border-term-border bg-black/20 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <a
                  href={`/admin/tailored/${t.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-semibold text-term-accent hover:underline"
                >
                  {t.label}
                </a>
                <p className="text-xs text-term-dim">
                  {new Date(t.createdAt).toLocaleString()}
                  {t.model ? ` · ${t.model}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="shrink-0 rounded border border-term-border px-2 py-1 text-xs text-term-dim hover:border-red-400 hover:text-red-400"
              >
                ✕ delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
