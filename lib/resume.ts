import "server-only";
import { cache } from "react";
import { getDb } from "./db";
import type {
  ResumeData,
  Profile,
  SocialLink,
  Job,
  SkillGroup,
  Project,
  SchoolEntry,
} from "./data";

const j = <T>(s: string): T => JSON.parse(s) as T;

/**
 * Read the full résumé from SQLite and assemble it into the shape the UI
 * consumes. Wrapped in React.cache so multiple server components in one request
 * share a single read.
 */
export const getResumeData = cache((): ResumeData => {
  const db = getDb();

  const p = db.prepare("SELECT * FROM profile WHERE id = 1").get() as
    | Record<string, string>
    | undefined;

  // Fallback (should never happen — DB seeds on creation) keeps the page alive.
  const profile: Profile = p
    ? {
        name: p.name,
        username: p.username,
        host: p.host,
        title: p.title,
        tagline: p.tagline,
        location: p.location,
        email: p.email,
        about: j<string[]>(p.about),
        stats: j<{ label: string; value: string }[]>(p.stats),
      }
    : {
        name: "",
        username: "user",
        host: "localhost",
        title: "",
        tagline: "",
        location: "",
        email: "",
        about: [],
        stats: [],
      };

  const socials = (
    db.prepare("SELECT label, handle, href FROM socials ORDER BY sort").all() as SocialLink[]
  );

  const experience = (
    db
      .prepare("SELECT * FROM experience ORDER BY sort")
      .all() as Record<string, string>[]
  ).map<Job>((r) => ({
    company: r.company,
    role: r.role,
    period: r.period,
    location: r.location,
    summary: r.summary,
    highlights: j<string[]>(r.highlights),
    stack: j<string[]>(r.stack),
  }));

  const skills = (
    db.prepare("SELECT label, items FROM skills ORDER BY sort").all() as Record<
      string,
      string
    >[]
  ).map<SkillGroup>((r) => ({ label: r.label, items: j<string[]>(r.items) }));

  const projects = (
    db
      .prepare("SELECT * FROM projects ORDER BY sort")
      .all() as Record<string, string | null>[]
  ).map<Project>((r) => ({
    name: r.name as string,
    slug: r.slug as string,
    description: r.description as string,
    stack: j<string[]>(r.stack as string),
    href: r.href || undefined,
    repo: r.repo || undefined,
  }));

  const education = (
    db
      .prepare("SELECT * FROM education ORDER BY sort")
      .all() as Record<string, string | null>[]
  ).map<SchoolEntry>((r) => ({
    school: r.school as string,
    credential: r.credential as string,
    period: r.period as string,
    detail: r.detail || undefined,
  }));

  return { profile, socials, experience, skills, projects, education };
});

/* -------------------------------------------------------------------------- */
/*  Writes — each replaces a whole section transactionally.                   */
/* -------------------------------------------------------------------------- */

export function saveProfile(profile: Profile) {
  getDb()
    .prepare(
      `UPDATE profile SET name=@name, username=@username, host=@host, title=@title,
         tagline=@tagline, location=@location, email=@email, about=@about, stats=@stats
       WHERE id = 1`,
    )
    .run({
      ...profile,
      about: JSON.stringify(profile.about),
      stats: JSON.stringify(profile.stats),
    });
}

export function saveSocials(socials: SocialLink[]) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM socials").run();
    const ins = db.prepare(
      "INSERT INTO socials (sort, label, handle, href) VALUES (?, ?, ?, ?)",
    );
    socials.forEach((s, i) => ins.run(i, s.label, s.handle, s.href));
  })();
}

export function saveExperience(jobs: Job[]) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM experience").run();
    const ins = db.prepare(
      `INSERT INTO experience (sort, company, role, period, location, summary, highlights, stack)
       VALUES (@sort, @company, @role, @period, @location, @summary, @highlights, @stack)`,
    );
    jobs.forEach((job, i) =>
      ins.run({
        ...job,
        sort: i,
        highlights: JSON.stringify(job.highlights),
        stack: JSON.stringify(job.stack),
      }),
    );
  })();
}

export function saveSkills(groups: SkillGroup[]) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM skills").run();
    const ins = db.prepare(
      "INSERT INTO skills (sort, label, items) VALUES (?, ?, ?)",
    );
    groups.forEach((g, i) => ins.run(i, g.label, JSON.stringify(g.items)));
  })();
}

export function saveProjects(projects: Project[]) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM projects").run();
    const ins = db.prepare(
      `INSERT INTO projects (sort, name, slug, description, stack, href, repo)
       VALUES (@sort, @name, @slug, @description, @stack, @href, @repo)`,
    );
    projects.forEach((p, i) =>
      ins.run({
        ...p,
        sort: i,
        stack: JSON.stringify(p.stack),
        href: p.href || null,
        repo: p.repo || null,
      }),
    );
  })();
}

export function saveEducation(entries: SchoolEntry[]) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM education").run();
    const ins = db.prepare(
      `INSERT INTO education (sort, school, credential, period, detail)
       VALUES (@sort, @school, @credential, @period, @detail)`,
    );
    entries.forEach((e, i) =>
      ins.run({ ...e, sort: i, detail: e.detail || null }),
    );
  })();
}
