import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { defaultResumeData } from "./data";

/**
 * SQLite connection + schema + first-run seeding.
 *
 * The DB file lives at DATABASE_PATH (default ./data/resume.db). That path is
 * deliberately OUTSIDE the files the deploy script rsyncs, so your edits
 * survive deploys. The connection is cached on globalThis so Next.js dev HMR
 * doesn't open a new handle on every reload.
 */

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "resume.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS profile (
  id       INTEGER PRIMARY KEY CHECK (id = 1),
  name     TEXT NOT NULL,
  username TEXT NOT NULL,
  host     TEXT NOT NULL,
  title    TEXT NOT NULL,
  tagline  TEXT NOT NULL,
  location TEXT NOT NULL,
  email    TEXT NOT NULL,
  about    TEXT NOT NULL, -- JSON string[]
  stats    TEXT NOT NULL  -- JSON {label,value}[]
);
CREATE TABLE IF NOT EXISTS socials (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  sort  INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  handle TEXT NOT NULL,
  href  TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS experience (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  sort     INTEGER NOT NULL DEFAULT 0,
  company  TEXT NOT NULL,
  role     TEXT NOT NULL,
  period   TEXT NOT NULL,
  location TEXT NOT NULL,
  summary  TEXT NOT NULL,
  highlights TEXT NOT NULL, -- JSON string[]
  stack      TEXT NOT NULL  -- JSON string[]
);
CREATE TABLE IF NOT EXISTS skills (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  sort  INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  items TEXT NOT NULL -- JSON string[]
);
CREATE TABLE IF NOT EXISTS projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  sort        INTEGER NOT NULL DEFAULT 0,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT NOT NULL,
  stack       TEXT NOT NULL, -- JSON string[]
  href        TEXT,
  repo        TEXT
);
CREATE TABLE IF NOT EXISTS education (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  sort       INTEGER NOT NULL DEFAULT 0,
  school     TEXT NOT NULL,
  credential TEXT NOT NULL,
  period     TEXT NOT NULL,
  detail     TEXT
);
`;

type DB = Database.Database;

const globalForDb = globalThis as unknown as { __resumeDb?: DB };

function createConnection(): DB {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  seedIfEmpty(db);
  return db;
}

/** Populate the DB from defaultResumeData the first time it's created. */
function seedIfEmpty(db: DB) {
  const seeded = db.prepare("SELECT id FROM profile WHERE id = 1").get();
  if (seeded) return;

  const d = defaultResumeData;
  const seed = db.transaction(() => {
    db.prepare(
      `INSERT INTO profile (id, name, username, host, title, tagline, location, email, about, stats)
       VALUES (1, @name, @username, @host, @title, @tagline, @location, @email, @about, @stats)`,
    ).run({
      ...d.profile,
      about: JSON.stringify(d.profile.about),
      stats: JSON.stringify(d.profile.stats),
    });

    const insSocial = db.prepare(
      "INSERT INTO socials (sort, label, handle, href) VALUES (?, ?, ?, ?)",
    );
    d.socials.forEach((s, i) => insSocial.run(i, s.label, s.handle, s.href));

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

    const insSkill = db.prepare(
      "INSERT INTO skills (sort, label, items) VALUES (?, ?, ?)",
    );
    d.skills.forEach((g, i) => insSkill.run(i, g.label, JSON.stringify(g.items)));

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

    const insEdu = db.prepare(
      `INSERT INTO education (sort, school, credential, period, detail)
       VALUES (@sort, @school, @credential, @period, @detail)`,
    );
    d.education.forEach((e, i) =>
      insEdu.run({ ...e, sort: i, detail: e.detail ?? null }),
    );
  });
  seed();
}

export function getDb(): DB {
  if (!globalForDb.__resumeDb) {
    globalForDb.__resumeDb = createConnection();
  }
  return globalForDb.__resumeDb;
}
