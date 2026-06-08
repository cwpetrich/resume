"use client";

import { useState } from "react";
import type {
  Profile,
  SocialLink,
  Job,
  SkillGroup,
  Project,
  SchoolEntry,
} from "@/lib/data";
import {
  saveProfileAction,
  saveSocialsAction,
  saveExperienceAction,
  saveSkillsAction,
  saveProjectsAction,
  saveEducationAction,
} from "@/app/admin/actions";
import { TextInput, TextArea, StringList, ListEditor, SectionCard } from "./ui";

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

/* --------------------------------- Experience -------------------------------- */
export function ExperienceForm({ initial }: { initial: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initial);
  return (
    <SectionCard
      id="experience"
      title="Experience"
      hint="Lead bullets with impact; quantify where you can."
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
            <StringList
              label="highlights"
              values={jb.highlights}
              onChange={(highlights) => update({ highlights })}
              placeholder="Did X resulting in Y…"
              multiline
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
