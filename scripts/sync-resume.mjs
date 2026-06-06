#!/usr/bin/env node
/**
 * Push the seed content (lib/data.ts -> defaultResumeData) into the LIVE
 * SQLite database, overwriting every section. Run this on the server after
 * deploying when you want the running site to match the committed seed.
 *
 *   node scripts/sync-resume.mjs
 *
 * Honors DATABASE_PATH (same default as lib/db.ts: ./data/resume.db). The
 * write logic mirrors lib/resume.ts — each section is replaced transactionally.
 *
 * NOTE: this is destructive. It DELETEs and re-inserts socials, experience,
 * skills, projects, and education, and overwrites the single profile row, so
 * any edits made through /admin that aren't reflected in the seed will be lost.
 */
import Database from "better-sqlite3";
import { createRequire } from "node:module";
import { register } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "resume.db");

// lib/data.ts is pure types + a data literal (no server-only imports), so we
// can load it directly through a TS loader. Fall back to a clear error if the
// loader isn't available in this Node runtime.
async function loadSeed() {
  try {
    // Node >= 20.6 ships an experimental TS-stripping loader via tsx if present.
    const require = createRequire(import.meta.url);
    require.resolve("tsx");
    register("tsx/esm", pathToFileURL("./"));
  } catch {
    // tsx not installed — that's fine if Node can strip types natively.
  }
  const mod = await import(pathToFileURL(path.resolve("lib/data.ts")).href);
  return mod.defaultResumeData;
}

const data = await loadSeed();

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const sync = db.transaction((d) => {
  // profile (single row, id = 1) — upsert so a fresh DB works too.
  db.prepare(
    `INSERT INTO profile (id, name, username, host, title, tagline, location, email, about, stats)
     VALUES (1, @name, @username, @host, @title, @tagline, @location, @email, @about, @stats)
     ON CONFLICT(id) DO UPDATE SET
       name=@name, username=@username, host=@host, title=@title, tagline=@tagline,
       location=@location, email=@email, about=@about, stats=@stats`,
  ).run({
    ...d.profile,
    about: JSON.stringify(d.profile.about),
    stats: JSON.stringify(d.profile.stats),
  });

  db.prepare("DELETE FROM socials").run();
  const insSocial = db.prepare(
    "INSERT INTO socials (sort, label, handle, href) VALUES (?, ?, ?, ?)",
  );
  d.socials.forEach((s, i) => insSocial.run(i, s.label, s.handle, s.href));

  db.prepare("DELETE FROM experience").run();
  const insExp = db.prepare(
    `INSERT INTO experience (sort, company, role, period, location, summary, highlights, stack)
     VALUES (@sort, @company, @role, @period, @location, @summary, @highlights, @stack)`,
  );
  d.experience.forEach((j, i) =>
    insExp.run({
      ...j,
      sort: i,
      highlights: JSON.stringify(j.highlights),
      stack: JSON.stringify(j.stack),
    }),
  );

  db.prepare("DELETE FROM skills").run();
  const insSkill = db.prepare(
    "INSERT INTO skills (sort, label, items) VALUES (?, ?, ?)",
  );
  d.skills.forEach((g, i) => insSkill.run(i, g.label, JSON.stringify(g.items)));

  db.prepare("DELETE FROM projects").run();
  const insProj = db.prepare(
    `INSERT INTO projects (sort, name, slug, description, stack, href, repo)
     VALUES (@sort, @name, @slug, @description, @stack, @href, @repo)`,
  );
  d.projects.forEach((p, i) =>
    insProj.run({
      ...p,
      sort: i,
      stack: JSON.stringify(p.stack),
      href: p.href ?? null,
      repo: p.repo ?? null,
    }),
  );

  db.prepare("DELETE FROM education").run();
  const insEdu = db.prepare(
    `INSERT INTO education (sort, school, credential, period, detail)
     VALUES (@sort, @school, @credential, @period, @detail)`,
  );
  d.education.forEach((e, i) =>
    insEdu.run({ ...e, sort: i, detail: e.detail ?? null }),
  );
});

sync(data);
db.close();

console.log(`Synced résumé seed into ${DB_PATH}`);
console.log(
  `  profile: ${data.profile.name} · ${data.experience.length} jobs · ` +
    `${data.skills.length} skill groups · ${data.projects.length} projects · ` +
    `${data.education.length} education`,
);
