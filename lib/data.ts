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
    host: "conradpetrich.me",
    title: "Senior Engineer · AI Tooling & Agentic Workflows",
    tagline:
      "I build enterprise applications, AI-augmented systems, and the tooling " +
      "that ships them — backed by a decade of experience. Currently open to new roles.",
    location: "Eagle Mountain, Utah",
    email: "conradpetrich@gmail.com",
    about: [
      "I'm a software engineer who builds AI-augmented systems and the tooling " +
        "that ships them. Over the last few years I've gone deep on agentic " +
        "development, working daily in Claude Code and OpenClaw. Outside of work " +
        "I run Side Questered, a small company where I build and maintain " +
        "open-source tools like ABS Butler.",
      "That's built on a decade of enterprise engineering: C# and .NET on the " +
        "backend, React and TypeScript on the front end, and event-driven, " +
        "microservice architectures on AWS and Azure in between. I care about " +
        "systems that are resilient, well-tested, and maintainable long after I've " +
        "moved on.",
      "This very site is a small proof of that: a Next.js app I designed, built, " +
        "and self-host on my own hardware behind a reverse proxy, deployed with a " +
        "single script. Poke around — there may be more here than meets the eye.",
    ],
    stats: [
      { label: "years shipping software", value: "10+" },
      { label: "AI dev tools in daily use", value: "3" },
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
      company: "BYU",
      role: "Senior Software Engineer",
      period: "Jul 2025 — Mar 2026",
      location: "Hybrid",
      summary: "Application development and architecture consulting.",
      highlights: [
        "Designed, built, and maintained applications in .NET, AngularJS, and Next.js.",
        "Consulted on application architecture and data integration across Redis, " +
          "SQL, and MongoDB.",
        "Deployed applications with Docker and Kubernetes.",
        "Maintained legacy applications and systems alongside new development.",
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
        "Built income verification features for non-traditional workers.",
        "Engineered C# / .NET microservices that communicate over AWS SNS and SQS.",
        "Managed SQL and MongoDB data stores covering a wide range of income types.",
      ],
      stack: ["C#", ".NET", "AWS", "SNS", "SQS", "MongoDB", "MySQL", "Docker", "Datadog", "Jenkins"],
    },
    {
      company: "Nerd United",
      role: "Senior Software Engineer",
      period: "Mar 2022 — Sep 2024",
      location: "Lehi, UT",
      summary: "Microservice platform development.",
      highlights: [
        "Architected, built, and maintained C# / .NET microservices, delivered as " +
          "versioned Docker images.",
        "Connected services through AWS SNS and SQS messaging.",
        "Built CI/CD pipelines with ArgoCD, Helm, and Kubernetes.",
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
        "Integrated third-party logistics APIs with Purple's systems on AWS.",
        "Built and maintained Node.js services supporting nationwide sales operations.",
        "Worked directly with partner companies to scope and deliver custom integrations.",
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
        "Built and maintained .NET and React projects used by security analysts.",
        "Developed a shared client and consultant portal for generating " +
          "cybersecurity reports and sharing them securely.",
        "Created attack-simulation modules that let clients test their network defenses.",
      ],
      stack: [".NET", "C#", "React", "TypeScript", "Azure"],
    },
    {
      company: "BYU",
      role: "Software Engineer",
      period: "Jan 2017 — Nov 2017",
      location: "Provo, UT",
      summary: "Large-scale web applications.",
      highlights: [
        "Integrated legacy ColdFusion servers with Canvas's Ruby on Rails API.",
        "Championed the move to CFScript, making the ColdFusion codebase more efficient.",
        "Ran training sessions on efficient DOM and vanilla JavaScript practices.",
        "Integrated libraries that improved developer experience and UI quality.",
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
        "Designed and built an internal payroll system for time tracking and check printing.",
        "Ported legacy escrow-management software from a DOS terminal app to an " +
          "Angular web app.",
        "Rewrote an outdated Visual Basic application in Ruby on Rails with MySQL.",
        "Built custom workflows to streamline agent coordination.",
      ],
      stack: ["Ruby on Rails", "Ruby", "AngularJS", "JavaScript", "CoffeeScript", "MySQL"],
    },
  ],

  skills: [
    {
      label: "AI / Agentic",
      items: [
        "Claude Code",
        "OpenClaw",
        "Agentic workflows",
        "LLM-driven TDD",
        "Prompt engineering",
      ],
    },
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
  ],

  projects: [
    {
      name: "ABS Butler",
      slug: "abs-butler",
      description:
        "A self-hosted butler for AudiobookShelf libraries: it audits for problems, " +
        "fills in and normalizes metadata, organizes files on disk, and tags books " +
        "with age bands and content flags. Every change is a dry run by default. " +
        "Ships as a Docker image and a Snap.",
      stack: ["TypeScript", "Node.js", "Docker", "Snap", "AudiobookShelf API"],
      repo: "https://github.com/cwpetrich/abs-butler",
    },
    {
      name: "Side Questered",
      slug: "sidequestered",
      description:
        "My small Utah software company, home to the side projects I build and " +
        "maintain: ABS Butler (free and open source) and Audiobook Co-op, a " +
        "multi-server AudiobookShelf player for Android and iOS, now in testing.",
      stack: ["TypeScript", "Open source", "Mobile"],
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
