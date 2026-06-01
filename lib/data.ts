/**
 * ============================================================================
 *  RESUME CONTENT — single source of truth
 * ============================================================================
 *  This is the ONLY file you need to edit to update the site's content.
 *  Everything marked `TODO` below is placeholder text — swap it for the real
 *  thing. The page, the interactive terminal, and the printable PDF all read
 *  from the data exported here.
 * ============================================================================
 */

export interface Job {
  company: string;
  role: string;
  /** e.g. "2021 — Present" */
  period: string;
  location: string;
  /** Short one-liner describing the company / context. */
  summary: string;
  /** Bullet points — lead with impact, quantify where you can. */
  highlights: string[];
  /** Tech used on this job (shows as tags). */
  stack: string[];
}

export interface Project {
  name: string;
  /** Used as the "directory" name in the terminal `ls projects/` output. */
  slug: string;
  description: string;
  stack: string[];
  /** Optional links. */
  href?: string;
  repo?: string;
}

export interface SchoolEntry {
  school: string;
  credential: string;
  period: string;
  detail?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SocialLink {
  label: string;
  /** Short handle shown in the terminal. */
  handle: string;
  href: string;
}

/* -------------------------------------------------------------------------- */
/*  Identity                                                                  */
/* -------------------------------------------------------------------------- */

export const profile = {
  name: "Conrad Petrich",
  /** Lowercase handle used as the shell username (e.g. conrad@petrich.dev). */
  username: "conrad",
  /** Host shown in the prompt — your domain reads well here. */
  host: "petrich.dev", // TODO: set to your real domain
  title: "Software Engineer", // TODO: your headline
  // TODO: a punchy one-sentence pitch.
  tagline:
    "I build resilient web applications and self-host the infrastructure they run on.",
  location: "United States", // TODO
  // TODO: 2–4 sentences. This is your `whoami` / about blurb.
  about: [
    "I'm a software engineer focused on building full-stack web applications " +
      "with TypeScript, React, and Next.js — and on owning the systems that " +
      "serve them in production.",
    "This very site is a small proof of that: a Next.js app I designed, built, " +
      "and self-host on my own server behind a reverse proxy, deployed with a " +
      "single script. Poke around — there may be more here than meets the eye.",
  ],
  /** Years of experience etc. — shown as quick stats. Tweak or remove. */
  stats: [
    { label: "years building software", value: "5+" }, // TODO
    { label: "production deploys", value: "∞" }, // TODO
    { label: "servers self-hosted", value: "1" }, // TODO
  ],
} as const;

/* -------------------------------------------------------------------------- */
/*  Contact & socials                                                         */
/* -------------------------------------------------------------------------- */

export const email = "conradpetrich@gmail.com";

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    handle: "@cwpetrich",
    href: "https://github.com/cwpetrich",
  },
  {
    label: "LinkedIn",
    handle: "in/your-handle", // TODO: your LinkedIn slug
    href: "https://www.linkedin.com/in/your-handle",
  },
  {
    label: "Email",
    handle: email,
    href: `mailto:${email}`,
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience                                                                */
/* -------------------------------------------------------------------------- */

export const experience: Job[] = [
  {
    company: "Company Name", // TODO
    role: "Senior Software Engineer", // TODO
    period: "2022 — Present", // TODO
    location: "Remote", // TODO
    summary: "One line about what this company does.", // TODO
    highlights: [
      "Led development of X, which did Y and resulted in Z% improvement.", // TODO
      "Designed and shipped the A feature used by N users / customers.", // TODO
      "Mentored engineers and owned the B subsystem end to end.", // TODO
    ],
    stack: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
  },
  {
    company: "Previous Company", // TODO
    role: "Software Engineer", // TODO
    period: "2019 — 2022", // TODO
    location: "City, ST", // TODO
    summary: "One line about what this company does.", // TODO
    highlights: [
      "Built and maintained C, improving D by E.", // TODO
      "Collaborated across teams to deliver F on schedule.", // TODO
    ],
    stack: ["JavaScript", "Python", "AWS", "Docker"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Skills                                                                     */
/* -------------------------------------------------------------------------- */

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Bash"], // TODO
  },
  {
    label: "Frameworks",
    items: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"], // TODO
  },
  {
    label: "Infrastructure",
    items: ["Linux", "Nginx", "Docker", "PM2", "CI/CD", "Self-hosting"], // TODO
  },
  {
    label: "Data",
    items: ["PostgreSQL", "Redis", "Prisma"], // TODO
  },
];

/* -------------------------------------------------------------------------- */
/*  Projects                                                                   */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    name: "This Résumé Site",
    slug: "resume",
    description:
      "The site you're looking at — a Next.js app with a fully interactive " +
      "terminal, hidden games, and a print-to-PDF résumé. Self-hosted on my " +
      "own hardware.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PM2"],
    repo: "https://github.com/cwpetrich/resume",
  },
  {
    name: "Project Two", // TODO
    slug: "project-two",
    description: "What it does and why it's interesting.", // TODO
    stack: ["TODO", "TODO"],
    href: "https://example.com", // TODO or remove
    repo: "https://github.com/cwpetrich/project-two", // TODO or remove
  },
  {
    name: "Project Three", // TODO
    slug: "project-three",
    description: "What it does and why it's interesting.", // TODO
    stack: ["TODO", "TODO"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Education / certifications                                                 */
/* -------------------------------------------------------------------------- */

export const education: SchoolEntry[] = [
  {
    school: "Your University", // TODO
    credential: "B.S. in Computer Science", // TODO
    period: "20XX — 20XX", // TODO
    detail: "Relevant coursework, honors, or activities.", // TODO or remove
  },
];
