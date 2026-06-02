/**
 * ============================================================================
 *  RESUME DATA — types + seed defaults
 * ============================================================================
 *  The live content now lives in a SQLite database (see lib/db.ts) and is
 *  edited through the admin panel at /admin. The `defaultResumeData` below is
 *  used to SEED that database the first time the app runs, so a fresh install
 *  looks identical to before until you start editing.
 *
 *  To change the *starting* content, edit `defaultResumeData`. To change the
 *  *live* content, log in at /admin.
 * ============================================================================
 */

export interface Profile {
  name: string;
  /** Lowercase handle used as the shell username (e.g. conrad@petrich.dev). */
  username: string;
  /** Host shown in the prompt + meta tags — your domain reads well here. */
  host: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  /** Paragraphs for the `whoami` / about blurb. */
  about: string[];
  /** Quick stats shown in the hero. */
  stats: { label: string; value: string }[];
}

export interface SocialLink {
  label: string;
  /** Short handle shown in the terminal. */
  handle: string;
  href: string;
}

export interface Job {
  company: string;
  role: string;
  /** e.g. "2021 — Present" */
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Project {
  name: string;
  slug: string;
  description: string;
  stack: string[];
  href?: string;
  repo?: string;
}

export interface SchoolEntry {
  school: string;
  credential: string;
  period: string;
  detail?: string;
}

/** The full assembled shape the UI consumes. */
export interface ResumeData {
  profile: Profile;
  socials: SocialLink[];
  experience: Job[];
  skills: SkillGroup[];
  projects: Project[];
  education: SchoolEntry[];
}

/* -------------------------------------------------------------------------- */
/*  Seed defaults                                                             */
/* -------------------------------------------------------------------------- */

export const defaultResumeData: ResumeData = {
  profile: {
    name: "Conrad Petrich",
    username: "conrad",
    host: "petrich.dev", // TODO: set to your real domain
    title: "Software Engineer",
    tagline:
      "I build resilient web applications and self-host the infrastructure they run on.",
    location: "United States",
    email: "conradpetrich@gmail.com",
    about: [
      "I'm a software engineer focused on building full-stack web applications " +
        "with TypeScript, React, and Next.js — and on owning the systems that " +
        "serve them in production.",
      "This very site is a small proof of that: a Next.js app I designed, built, " +
        "and self-host on my own server behind a reverse proxy, deployed with a " +
        "single script. Poke around — there may be more here than meets the eye.",
    ],
    stats: [
      { label: "years building software", value: "5+" },
      { label: "production deploys", value: "∞" },
      { label: "servers self-hosted", value: "1" },
    ],
  },

  socials: [
    { label: "GitHub", handle: "@cwpetrich", href: "https://github.com/cwpetrich" },
    {
      label: "LinkedIn",
      handle: "in/conrad-petrich",
      href: "https://www.linkedin.com/in/conrad-petrich/",
    },
  ],

  experience: [
    {
      company: "Company Name",
      role: "Senior Software Engineer",
      period: "2022 — Present",
      location: "Remote",
      summary: "One line about what this company does.",
      highlights: [
        "Led development of X, which did Y and resulted in Z% improvement.",
        "Designed and shipped the A feature used by N users / customers.",
        "Mentored engineers and owned the B subsystem end to end.",
      ],
      stack: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
    },
    {
      company: "Previous Company",
      role: "Software Engineer",
      period: "2019 — 2022",
      location: "City, ST",
      summary: "One line about what this company does.",
      highlights: [
        "Built and maintained C, improving D by E.",
        "Collaborated across teams to deliver F on schedule.",
      ],
      stack: ["JavaScript", "Python", "AWS", "Docker"],
    },
  ],

  skills: [
    { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL", "Bash"] },
    { label: "Frameworks", items: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"] },
    { label: "Infrastructure", items: ["Linux", "Nginx", "Docker", "PM2", "CI/CD", "Self-hosting"] },
    { label: "Data", items: ["PostgreSQL", "SQLite", "Redis", "Prisma"] },
  ],

  projects: [
    {
      name: "This Résumé Site",
      slug: "resume",
      description:
        "The site you're looking at — a Next.js app with a fully interactive " +
        "terminal, hidden games, a database-backed admin panel, and a " +
        "print-to-PDF résumé. Self-hosted on my own hardware.",
      stack: ["Next.js", "TypeScript", "SQLite", "Tailwind CSS", "PM2"],
      repo: "https://github.com/cwpetrich/resume",
    },
    {
      name: "Project Two",
      slug: "project-two",
      description: "What it does and why it's interesting.",
      stack: ["TODO", "TODO"],
      href: "https://example.com",
      repo: "https://github.com/cwpetrich/project-two",
    },
    {
      name: "Project Three",
      slug: "project-three",
      description: "What it does and why it's interesting.",
      stack: ["TODO", "TODO"],
    },
  ],

  education: [
    {
      school: "Your University",
      credential: "B.S. in Computer Science",
      period: "20XX — 20XX",
      detail: "Relevant coursework, honors, or activities.",
    },
  ],
};
