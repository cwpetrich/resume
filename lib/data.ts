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
  highlights: Highlight[];
  stack: string[];
}

/**
 * A single granular fact about a role, tagged with what kind of fact it is.
 * The category is purely metadata for the job-tailoring tool (lib/tailorPlan.ts)
 * to match against what a job posting is asking for — it's never shown
 * differently in the public résumé, and the LLM only ever selects/reorders
 * existing highlights, never writes new ones.
 */
export interface Highlight {
  text: string;
  category?: HighlightCategory;
  /**
   * Whether this highlight appears on the generic (non-tailored) résumé shown
   * on the public site and the default PDF. Defaults to `true` when absent
   * (every highlight saved before this field existed keeps showing). Set to
   * `false` to keep a fact in the bank for the job-tailoring tool to draw on
   * without cluttering the generic résumé — e.g. a niche detail that's only
   * relevant to specific postings.
   */
  featured?: boolean;
}

/** True unless a highlight was explicitly opted out of the generic résumé. */
export function isFeaturedHighlight(h: Highlight): boolean {
  return h.featured !== false;
}

/** Jobs with only their generic-résumé highlights — for public-facing views. */
export function toPublicExperience(jobs: Job[]): Job[] {
  return jobs.map((j) => ({
    ...j,
    highlights: j.highlights.filter(isFeaturedHighlight),
  }));
}

export type HighlightCategory =
  | "scope"
  | "achievement"
  | "metric"
  | "challenge"
  | "leadership"
  | "collaboration";

/**
 * Fixed, deterministic prompts shown in the admin "Experience" editor as
 * quick-add buttons — clicking one adds a blank highlight pre-tagged with
 * that category, with the question as its placeholder. This is how you build
 * up a richer bank of real facts per role for the job-tailoring tool to draw
 * from, without needing an LLM (or any cost) just to fill out your own résumé.
 */
export const HIGHLIGHT_PROMPTS: {
  category: HighlightCategory;
  label: string;
  prompt: string;
}[] = [
  {
    category: "scope",
    label: "Scope & scale",
    prompt:
      "What was the scope of this role? (team size, systems owned, users/customers served, budget)",
  },
  {
    category: "achievement",
    label: "Key achievement",
    prompt: "What's a specific thing you built or shipped that you're proud of?",
  },
  {
    category: "metric",
    label: "Quantified impact",
    prompt:
      "What measurable outcome resulted from your work? (performance, cost, reliability, revenue, time saved)",
  },
  {
    category: "challenge",
    label: "Technical challenge",
    prompt: "What was the hardest technical problem you solved here, and how?",
  },
  {
    category: "leadership",
    label: "Leadership & ownership",
    prompt:
      "Did you lead, mentor, architect, or make key decisions? Describe your level of ownership.",
  },
  {
    category: "collaboration",
    label: "Cross-team collaboration",
    prompt: "Did you work directly with other teams, stakeholders, or clients? How?",
  },
];

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

/** A résumé variant generated and saved by the job-tailoring tool (admin only). */
export interface TailoredResumeRecord {
  id: string;
  createdAt: string;
  /** Short label the admin gives it, e.g. "Acme Corp — Staff Engineer". */
  label: string;
  jobDescription: string;
  /** LLM-written summary tailored to the posting, from real profile/experience facts only. */
  summary: string;
  /** Existing skill groups, reordered by relevance — items are never altered. */
  skills: SkillGroup[];
  /** Existing jobs, reordered by relevance, with highlights selected/reordered — never rewritten text. */
  experience: Job[];
  model: string;
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
    host: "conradpetrich.me",
    title: "Senior Software Engineer · .NET, Cloud & Full-Stack",
    tagline:
      "I build reliable enterprise systems in C# / .NET and TypeScript, from " +
      "event-driven microservices to the front ends people use — backed by a " +
      "decade of experience. Currently open to new roles.",
    location: "Eagle Mountain, Utah",
    email: "conradpetrich@gmail.com",
    about: [
      "I'm a senior software engineer with a decade of experience building " +
        "enterprise systems: C# and .NET on the backend, React and TypeScript on " +
        "the front end, and event-driven microservice architectures on AWS and " +
        "Azure in between. I've built security tooling, logistics integrations, " +
        "and income verification platforms, and I care about systems that are " +
        "resilient, well-tested, and maintainable long after I've moved on.",
      "I'm now building Side Questered LLC full-time, where I design, build, and ship " +
        "independent products: ABS Butler (open source), Audiobook Co-op (a cross-platform " +
        "self-hosted media client), and Bookdelver (a 3D roguelike mobile game in testing) " +
        "— with AI coding agents like Claude Code as a core part of how I build day to day.",
      "This very site is a small proof of that: a Next.js app I designed, built, " +
        "and self-host on my own hardware behind a reverse proxy, deployed with a " +
        "single script. Poke around — there may be more here than meets the eye.",
    ],
    stats: [
      { label: "years shipping software", value: "10+" },
      { label: "companies", value: "7" },
      { label: "servers self-hosted", value: "5" },
    ],
  },

  socials: [
    { label: "GitHub", handle: "@cwpetrich", href: "https://github.com/cwpetrich" },
    {
      label: "LinkedIn",
      handle: "in/conrad-petrich",
      href: "https://www.linkedin.com/in/conrad-petrich/",
    },
    { label: "Phone", handle: "+1 435 319 4528", href: "tel:+14353194528" },
  ],

  experience: [
    {
      company: "Side Questered LLC",
      role: "Founder & Software Engineer",
      period: "Mar 2026 — Present",
      location: "Eagle Mountain, UT",
      summary: "Independent software products: self-hosted media clients, a mobile game, and open-source server tooling.",
      highlights: [
        {
          text:
            "Founded and solely run Side Questered LLC, building and maintaining multiple " +
            "independent products end-to-end: Audiobook Co-op (a cross-platform client for " +
            "self-hosted Audiobookshelf, Plex, and Jellyfin servers), Bookdelver (a 3D " +
            "roguelike mobile game built on D&D-style mechanics), and ABS Butler (open-source " +
            "Audiobookshelf metadata curation and maintenance tooling), with more in the works.",
          category: "scope",
        },
        {
          text:
            "Designed and built Audiobook Co-op, letting self-hosters stream audiobooks and " +
            "read ebooks from their own Audiobookshelf, Plex, or Jellyfin servers on Android, " +
            "iOS, macOS, and web.",
          category: "achievement",
        },
        {
          text:
            "Designed and built Bookdelver, a 3D roguelike mobile game built on D&D-style " +
            "mechanics and gameplay.",
          category: "achievement",
        },
        {
          text:
            "Continued developing ABS Butler, the open-source Audiobookshelf metadata curation " +
            "and maintenance tool.",
          category: "achievement",
          featured: false,
        },
        {
          text:
            "Grown users, downloads, and revenue across all products daily since launch while " +
            "continuously shipping performance improvements.",
          category: "metric",
        },
        {
          text:
            "Growing an independent app portfolio without a paid-acquisition budget, focusing " +
            "on organic growth channels in the near term rather than paid advertising.",
          category: "challenge",
          featured: false,
        },
        {
          text:
            "As founder and sole employee, owns every product decision — architecture, " +
            "design, development, and release — end-to-end across all Side Questered products.",
          category: "leadership",
        },
        {
          text:
            "Built AI coding agents (Claude Code, Hermes, Cursor, VS Code) into the core of " +
            "the development workflow across all products, working across multiple LLM models.",
          category: "achievement",
        },
        {
          text:
            "Runs a feedback loop with friends, family, and colleagues as early testers, plus " +
            "in-app anonymous bug/feature reporting from real users, to directly shape product " +
            "development.",
          category: "collaboration",
        },
      ],
      stack: ["TypeScript", "Node.js", "Capacitor", "Kotlin", "Swift"],
    },
    {
      company: "BYU",
      role: "Senior Software Engineer",
      period: "Jul 2025 — Mar 2026",
      location: "Hybrid",
      summary: "Application development and architecture consulting.",
      highlights: [
        {
          text:
            "Full-time consulting engineer on a 4-person team (plus a team lead), serving as " +
            "the .NET / C# expert responsible for architecting, designing, and building the " +
            "backend services and database administration for 3 new projects.",
          category: "scope",
        },
        {
          text: "Designed, built, and maintained applications in .NET, AngularJS, and Next.js.",
          category: "achievement",
        },
        {
          text:
            "Consulted on application architecture and data integration across Redis, " +
            "SQL, and MongoDB.",
          category: "scope",
          featured: false,
        },
        {
          text: "Deployed applications with Docker and Kubernetes.",
          category: "achievement",
        },
        {
          text: "Maintained legacy applications and systems alongside new development.",
          category: "scope",
          featured: false,
        },
        {
          text:
            "Led migrating an existing ColdFusion codebase to C#, alongside building 3 new " +
            "projects from scratch.",
          category: "achievement",
        },
        {
          text:
            "Automated the database migration process, replacing error-prone, inconsistently " +
            "formatted manual SQL migrations with an enforced standard.",
          category: "metric",
        },
        {
          text:
            "Built new systems to work around very old, outdated underlying technology — " +
            "keeping everything backwards-compatible with, or at least aware of, its " +
            "limitations.",
          category: "challenge",
        },
        {
          text:
            "Owned the backend/database architecture for all 3 new projects end-to-end, and " +
            "mentored my own team and a second team on the newer unified .NET framework and " +
            "current C# features.",
          category: "leadership",
        },
        {
          text:
            "Worked closely with my engineering team, the system architect, and DevOps " +
            "engineers, answering questions and advising on Kubernetes deployment management.",
          category: "collaboration",
        },
      ],
      stack: [
        ".NET",
        "C#",
        "TypeScript",
        "Next.js",
        "AngularJS",
        "Docker",
        "Kubernetes",
        "SQL",
        "MongoDB",
        "ColdFusion",
      ],
    },
    {
      company: "Steady IQ",
      role: "Senior Software Engineer",
      period: "Sep 2024 — Jun 2025",
      location: "Remote",
      summary: "Event-driven microservices for income verification.",
      highlights: [
        {
          text:
            "On a ~6-engineer team building a microservice platform serving multiple U.S. " +
            "state government customers and thousands of end users.",
          category: "scope",
        },
        {
          text: "Built income verification features for non-traditional workers.",
          category: "achievement",
        },
        {
          text: "Engineered C# / .NET microservices that communicate over AWS SNS and SQS.",
          category: "achievement",
          featured: false,
        },
        {
          text: "Managed SQL and MongoDB data stores covering a wide range of income types.",
          category: "scope",
        },
        {
          text:
            "Built microservices as Docker images and deployed them to Kubernetes alongside " +
            "the rest of the engineering team.",
          category: "achievement",
        },
        {
          text:
            "Replaced direct HTTPS calls between microservices with AWS SNS/SQS messaging, " +
            "practically eliminating inter-service communication errors.",
          category: "metric",
        },
        {
          text:
            "Worked through an undocumented, multi-year-old codebase written by several past " +
            "contractors with no one left to explain its design decisions, building enough " +
            "understanding of it to safely extend and maintain it.",
          category: "challenge",
        },
        {
          text:
            "Owned the end-to-end design and implementation of the notification/queueing " +
            "layer connecting the microservices via AWS SNS and SQS, solo.",
          category: "leadership",
        },
        {
          text:
            "Worked daily with the rest of the engineering team and with DevOps to keep " +
            "releases deploying smoothly.",
          category: "collaboration",
        },
      ],
      stack: ["C#", ".NET", "AWS", "SNS", "SQS", "MongoDB", "MySQL", "Docker", "Kubernetes", "Datadog", "Jenkins"],
    },
    {
      company: "Nerd United",
      role: "Senior Software Engineer",
      period: "Mar 2022 — Sep 2024",
      location: "Lehi, UT",
      summary: "Microservice platform development.",
      highlights: [
        {
          text:
            "Worked on a whitelabel core platform (memberships, user management, crypto " +
            "wallets, product/purchasing, licensing, messaging, shopping, rewards, and more) " +
            "used by multiple partner companies, on an engineering org that scaled up to ~22 " +
            "people before splitting into smaller 6–8 person teams.",
          category: "scope",
        },
        {
          text:
            "Architected, built, and maintained at least 6 C# / .NET microservices, delivered " +
            "as versioned Docker images.",
          category: "achievement",
        },
        {
          text: "Connected services through AWS SNS and SQS messaging.",
          category: "achievement",
          featured: false,
        },
        {
          text: "Built CI/CD pipelines with ArgoCD, Helm, and Kubernetes.",
          category: "achievement",
        },
        {
          text:
            "Tuned the CI/CD pipeline to cut feature-complete-to-release time from several " +
            "hours down to within about 1 hour.",
          category: "metric",
        },
        {
          text:
            "Worked to keep cross-service knowledge shared across the engineering org as the " +
            "microservice count grew, specifically countering hyper-specialization where " +
            "engineers would silo themselves to a single service.",
          category: "challenge",
        },
        {
          text:
            "Owned the microservice architecture end-to-end, partnering directly with DevOps " +
            "on rollout, and led recurring engineering-wide discussions to keep the team " +
            "aligned on technical direction and practices.",
          category: "leadership",
        },
        {
          text:
            "Mentored several engineers, including multiple interns and junior engineers, " +
            "some over multiple years.",
          category: "leadership",
        },
        {
          text:
            "Gathered requirements directly from QA, DevOps, IT, marketing, product, " +
            "management, executives, and partnered client businesses to shape features and " +
            "fixes for the core platform.",
          category: "collaboration",
        },
      ],
      stack: [
        ".NET",
        "C#",
        "Docker",
        "Kubernetes",
        "Helm",
        "ArgoCD",
        "Entity Framework",
        "SQL",
        "MongoDB",
        "Redis",
        "AWS",
        "TypeScript",
        "Next.js",
      ],
    },
    {
      company: "Purple",
      role: "Software Engineer",
      period: "Apr 2021 — Mar 2022",
      location: "Lehi, UT",
      summary: "Logistics and partner integrations.",
      highlights: [
        {
          text:
            "One of ~12 engineers each assigned ownership of specific logistics-partner " +
            "integrations, including direct communication with each partner's representatives.",
          category: "scope",
        },
        {
          text: "Integrated third-party logistics APIs with Purple's systems on AWS.",
          category: "achievement",
        },
        {
          text: "Built and maintained Node.js services supporting nationwide sales operations.",
          category: "scope",
          featured: false,
        },
        {
          text:
            "Maintained high-volume, nationwide logistics integrations post-launch — " +
            "debugging failures and keeping partner communication accurate and stable.",
          category: "metric",
        },
        {
          text:
            "Delivered partner integrations despite wide variance in partner readiness — " +
            "progress depended heavily on whether a partner had a reachable, knowledgeable " +
            "engineer and usable API documentation on their side, which was the exception " +
            "rather than the norm.",
          category: "challenge",
        },
        {
          text:
            "Owned every integration I worked on end-to-end and made the key technical calls " +
            "on how to handle issues as they came up.",
          category: "leadership",
        },
        {
          text: "Worked directly with partner companies to scope and deliver custom integrations.",
          category: "collaboration",
        },
      ],
      stack: ["JavaScript", "Node.js", "AWS", "SQL"],
    },
    {
      company: "Silent Break Security / NetSPI",
      role: "Software Engineer",
      period: "Nov 2017 — Apr 2021",
      location: "Lehi, UT",
      summary: "Full-stack security tooling.",
      highlights: [
        {
          text:
            "Worked on a large, well-organized .NET Core / C# and React codebase on a team " +
            "that ranged from 2 to 4 engineers, building the client portal used by 6–12 " +
            "security analysts/consultants and hundreds of client organizations.",
          category: "scope",
        },
        {
          text: "Built and maintained .NET Core / C# and React (TypeScript) projects used by security analysts.",
          category: "achievement",
          featured: false,
        },
        {
          text:
            "Developed a shared client and consultant portal for generating " +
            "cybersecurity reports and sharing them securely.",
          category: "achievement",
        },
        {
          text:
            "Built templated findings and report-structure tooling into the portal that cut " +
            "hours off writing each security assessment report versus writing them by hand, " +
            "and gave clients a single channel to receive both communication and findings — " +
            "noticeably reducing analysts' time spent manually coordinating with clients.",
          category: "metric",
        },
        {
          text: "Created attack-simulation modules that let clients test their network defenses.",
          category: "achievement",
          featured: false,
        },
        {
          text:
            "Built attack-simulation modules that required researching why specific exploits " +
            "worked in order to safely replicate them, while making sure client companies could " +
            "run the simulations themselves against their own networks and hardware without risk.",
          category: "challenge",
        },
        {
          text:
            "Owned the report-generation and findings-templating system end-to-end within the " +
            "client portal, and took turns with the team researching and presenting new " +
            "technologies/techniques to each other to grow the team's skills.",
          category: "leadership",
        },
        {
          text:
            "Coordinated daily with the engineering team on task scheduling, and worked " +
            "directly with the security consultants/analysts to gather their pain points and " +
            "feature requests for the portal and tooling.",
          category: "collaboration",
        },
      ],
      stack: [".NET Core", "C#", "React", "TypeScript", "Azure"],
    },
    {
      company: "BYU",
      role: "Software Engineer",
      period: "Jan 2017 — Nov 2017",
      location: "Provo, UT",
      summary: "Large-scale web applications.",
      highlights: [
        {
          text:
            "Worked on an extremely large ColdFusion codebase used by thousands of " +
            "students worldwide, as one of 4 engineers on a team (plus a sibling team of 4 " +
            "and ~8 student QA engineers handling test writing and manual verification).",
          category: "scope",
        },
        {
          text: "Integrated legacy ColdFusion servers with Canvas's Ruby on Rails API.",
          category: "achievement",
        },
        {
          text:
            "Debugged and integrated against Canvas's Ruby on Rails API with little available " +
            "documentation at the time, alongside maintaining ColdFusion — a language with " +
            "limited tooling and community support even then.",
          category: "challenge",
        },
        {
          text:
            "Championed and led the migration from legacy ColdFusion tags to CFScript, " +
            "cutting the amount of code required for equivalent functionality by almost half.",
          category: "leadership",
        },
        {
          text: "Ran training sessions on efficient DOM and vanilla JavaScript practices.",
          category: "leadership",
        },
        {
          text: "Integrated libraries that improved developer experience and UI quality.",
          category: "achievement",
        },
        {
          text:
            "Partnered directly with another team member and the system architect on the " +
            "ColdFusion/Canvas integration work.",
          category: "collaboration",
          featured: false,
        },
      ],
      stack: ["ColdFusion", "JavaScript", "Ruby", "Ruby on Rails", "SQL"],
    },
    {
      company: "EFusion Programming",
      role: "Software Engineer",
      period: "Feb 2015 — Dec 2016",
      location: "St. George, UT",
      summary: "Real-time tooling and payroll systems.",
      highlights: [
        {
          text:
            "Owned the company's core business application plus the payroll and " +
            "escrow-management platforms, as one of 2 developers on a 6-person team " +
            "(2 devs, 1 DBA, 2 IT, 1 manager) serving 50–100 employees company-wide.",
          category: "scope",
        },
        {
          text:
            "Designed and built an internal payroll system from scratch, handling " +
            "clock-in/out, pay stub generation, and check printing across multiple time zones.",
          category: "achievement",
        },
        {
          text:
            "Replaced an aging dot-matrix-only payroll printing workflow with a modern, " +
            "automatically-updating system supporting standard printers for pay stubs and checks.",
          category: "metric",
          featured: false,
        },
        {
          text:
            "Built a self-service GUI for employees to view digital pay/hours records and " +
            "submit clock-in/out, PTO, and time-off requests, with a manager approval step " +
            "to prevent dishonest time entries.",
          category: "metric",
          featured: false,
        },
        {
          text:
            "Added automatic state-based task handoff to the core application, used by " +
            "every employee, so finished work routed to the next person instantly instead of " +
            "waiting on manual communication — cutting hours off most task turnaround times " +
            "and eliminating tasks silently slipping through the cracks.",
          category: "metric",
        },
        {
          text:
            "Rebuilt the company's escrow-management system, previously usable only on a " +
            "single aging DOS machine by one employee, as a modern web app — including " +
            "migrating all historical escrow data to the new system.",
          category: "achievement",
        },
        {
          text:
            "Migrated a live, mission-critical DOS escrow application to Ruby on Rails and " +
            "Angular with zero safe way to test against real accounts, working one-on-one for " +
            "months with the sole employee who knew the legacy system — who was initially " +
            "hostile, fearing the rewrite would replace her — to get it right without ever " +
            "corrupting live escrow data.",
          category: "challenge",
          featured: false,
        },
        {
          text:
            "In my first full-time engineering role, became the de-facto single point of " +
            "contact for every department with no intermediary between me and the employees " +
            "I built for — a responsibility that grew faster than expected and required " +
            "learning to triage and push back on competing priorities early in my career.",
          category: "challenge",
          featured: false,
        },
        {
          text: "Rewrote an outdated Visual Basic application in Ruby on Rails with MySQL.",
          category: "achievement",
        },
        {
          text:
            "Owned the payroll system and the DOS-to-web escrow migration end-to-end solo, " +
            "from architecture and design through implementation and rollout.",
          category: "leadership",
        },
        {
          text: "Built custom workflows to streamline agent coordination.",
          category: "collaboration",
          featured: false,
        },
      ],
      stack: ["Ruby on Rails", "Ruby", "AngularJS", "JavaScript", "CoffeeScript", "MySQL", "Visual Basic"],
    },
  ],

  skills: [
    { label: "Languages", items: ["C#", "TypeScript", "JavaScript", "SQL"] },
    {
      label: "Frameworks",
      items: [".NET / .NET Core", "Entity Framework", "Node.js", "React", "Next.js", "Angular"],
    },
    {
      label: "Infrastructure",
      items: ["Docker", "Kubernetes", "Helm", "ArgoCD", "AWS", "Azure", "GitHub Actions"],
    },
    { label: "Data", items: ["SQL Server", "MySQL", "MongoDB", "Redis"] },
    {
      label: "AI Tooling",
      items: [
        "Claude Code",
        "OpenClaw",
        "Agentic workflows",
        "LLM-driven TDD",
        "Prompt engineering",
      ],
    },
  ],

  projects: [
    {
      name: "Audiobook Co-op",
      slug: "audiobook-co-op",
      description:
        "A cross-platform client for self-hosted audiobook and ebook libraries: connects " +
        "to your own Audiobookshelf, Plex, or Jellyfin servers so you can stream audiobooks " +
        "and read ebooks on Android, iOS, macOS, and web. Publicly launched.",
      stack: ["TypeScript", "Node.js", "Capacitor", "Kotlin", "Swift"],
      href: "https://sidequestered.com/audiobookcoop/",
    },
    {
      name: "Bookdelver",
      slug: "bookdelver",
      description:
        "A 3D roguelike mobile game built on D&D-style mechanics and gameplay. Currently " +
        "in testing.",
      stack: ["TypeScript", "Node.js", "Capacitor", "Kotlin", "Swift"],
      href: "https://sidequestered.com/bookdelver/",
    },
    {
      name: "ABS Butler",
      slug: "abs-butler",
      description:
        "A self-hosted butler for AudiobookShelf libraries: it audits for problems, " +
        "fills in and normalizes metadata, organizes files on disk, and tags books " +
        "with age bands and content flags. Every change is a dry run by default. " +
        "Ships as a Docker image and a Snap.",
      stack: ["TypeScript", "Node.js", "Docker", "Snap", "AudiobookShelf API"],
      href: "https://sidequestered.com/absbutler/",
      repo: "https://github.com/cwpetrich/abs-butler",
    },
    {
      name: "Side Questered",
      slug: "sidequestered",
      description:
        "My small Utah software company, home to the independent products I build and " +
        "maintain: ABS Butler (free and open source), Audiobook Co-op (a cross-platform " +
        "client for self-hosted Audiobookshelf, Plex, and Jellyfin libraries on Android, " +
        "iOS, macOS, and web, publicly launched), and Bookdelver (a 3D roguelike mobile " +
        "game built on D&D-style mechanics, currently in testing).",
      stack: ["TypeScript", "Kotlin", "Swift", "Capacitor", "Open source", "Mobile"],
      href: "https://sidequestered.com",
    },
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
  ],

  education: [
    {
      school: "Dixie State University",
      credential: "B.S. in Computer Science",
      period: "2016",
      detail: "St. George, UT",
    },
  ],
};
