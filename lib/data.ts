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
    title: "Senior Software Engineer",
    tagline:
      "I build resilient, enterprise-grade systems across the full stack — and self-host the infrastructure they run on.",
    location: "Eagle Mountain, Utah",
    email: "conradpetrich@gmail.com",
    about: [
      "I'm a senior software engineer with 10+ years building enterprise systems " +
        "and full-stack web applications — C# and .NET on the backend, React and " +
        "TypeScript on the front end, and event-driven, microservice architectures " +
        "on AWS and Azure in between.",
      "This very site is a small proof of that: a Next.js app I designed, built, " +
        "and self-host on my own server behind a reverse proxy, deployed with a " +
        "single script. Poke around — there may be more here than meets the eye.",
    ],
    stats: [
      { label: "years building software", value: "10+" },
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
    { label: "Phone", handle: "+1 435 319 4528", href: "tel:+14353194528" },
  ],

  experience: [
    {
      company: "BYU",
      role: "Senior Software Engineer",
      period: "Jul 2025 — Mar 2026",
      location: "Hybrid",
      summary: "Software engineering for Brigham Young University.",
      highlights: [
        "Provide consultation on software architecture and tooling while building " +
          "new applications and maintaining legacy applications and systems.",
      ],
      stack: [],
    },
    {
      company: "Steady IQ",
      role: "Senior Software Engineer",
      period: "Sep 2024 — Jun 2025",
      location: "Remote",
      summary: "Enterprise-grade event-driven systems.",
      highlights: [
        "Designed, built, and maintained enterprise-level systems using C# with " +
          ".NET Core, focusing on event-driven architecture with AWS services like " +
          "SNS and SQS.",
        "Managed multiple database types including MongoDB and MySQL, ensuring high " +
          "code quality, adherence to best practices, and efficient solution delivery.",
      ],
      stack: ["C#", ".NET Core", "AWS", "SNS", "SQS", "MongoDB", "MySQL"],
    },
    {
      company: "Nerd United",
      role: "Senior Software Engineer",
      period: "Mar 2022 — Sep 2024",
      location: "Lehi, UT",
      summary: "Microservice platform development.",
      highlights: [
        "Designed and implemented .NET web APIs as microservices deployed via Docker " +
          "in Kubernetes, using SQL Server with Entity Framework and reducing build times.",
        "Spearheaded the extraction of common libraries from a monorepo, creating " +
          "CI/CD pipelines with GitHub Actions to streamline NuGet package creation, " +
          "reducing deployment time and improving code modularity.",
        "Developed custom tools and established migration patterns for SQL Server, " +
          "enhancing engineering efficiency; mentored interns to foster team growth " +
          "and knowledge sharing.",
      ],
      stack: [
        ".NET",
        "Docker",
        "Kubernetes",
        "SQL Server",
        "Entity Framework",
        "GitHub Actions",
        "CI/CD",
      ],
    },
    {
      company: "Purple",
      role: "Software Engineer",
      period: "Apr 2021 — Mar 2022",
      location: "Lehi, UT",
      summary: "Logistics and partner integrations.",
      highlights: [
        "Collaborated with clients to gather requirements and deliver custom 3rd-party " +
          "API integrations, optimizing logistics operations between Purple and several " +
          "partnering companies.",
      ],
      stack: [],
    },
    {
      company: "Silent Break Security / NetSPI",
      role: "Software Engineer",
      period: "Nov 2017 — Apr 2021",
      location: "Lehi, UT",
      summary: "Full-stack security tooling.",
      highlights: [
        "Built an enterprise-level application as a full-stack engineer, utilizing .NET " +
          "backend services in Azure, SQL Server for the database, and ReactJS with " +
          "TypeScript for the frontend.",
        "Developed custom MITRE ATT&CK-based self-assessment tools and reporting " +
          "solutions, boosting efficiency for security analysts and enabling secure " +
          "digital report sharing with clients.",
      ],
      stack: [".NET", "Azure", "SQL Server", "React", "TypeScript"],
    },
    {
      company: "BYU",
      role: "Software Engineer",
      period: "Jan 2017 — Nov 2017",
      location: "Provo, UT",
      summary: "Large-scale web applications.",
      highlights: [
        "Developed large-scale web applications as a full-stack engineer, leveraging " +
          "ColdFusion, SQL Server, and JavaScript to deliver solutions for a global " +
          "user base.",
      ],
      stack: ["ColdFusion", "SQL Server", "JavaScript"],
    },
    {
      company: "EFusion Programming",
      role: "Software Engineer",
      period: "Feb 2015 — Dec 2017",
      location: "St. George, UT",
      summary: "Real-time tooling and payroll systems.",
      highlights: [
        "Developed real-time communication tools using WebSockets and built a time " +
          "clock and payroll management system, efficiently tracking user hours across " +
          "multiple time zones and generating printable payroll documents.",
      ],
      stack: ["WebSockets", "JavaScript"],
    },
  ],

  skills: [
    { label: "Languages", items: ["C#", "TypeScript", "JavaScript", "SQL"] },
    { label: "Frameworks", items: [".NET / .NET Core", "Node.js", "React", "Entity Framework"] },
    { label: "Infrastructure", items: ["Docker", "Kubernetes", "AWS", "Azure", "CI/CD", "GitHub Actions"] },
    { label: "Data", items: ["SQL Server", "MySQL", "MongoDB"] },
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
