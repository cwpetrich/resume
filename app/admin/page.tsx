import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getResumeData } from "@/lib/resume";
import LogoutButton from "@/components/admin/LogoutButton";
import {
  ProfileForm,
  SocialsForm,
  ExperienceForm,
  SkillsForm,
  ProjectsForm,
  EducationForm,
} from "@/components/admin/AdminForms";

export const metadata = { title: "Admin", robots: { index: false } };

// Always reflect the latest DB state when editing.
export const dynamic = "force-dynamic";

const NAV = [
  ["profile", "Profile"],
  ["socials", "Socials"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["education", "Education"],
];

export default async function AdminPage() {
  // Defense in depth: middleware also guards this route.
  if (!(await getCurrentSession())) redirect("/login");

  const data = getResumeData();

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-30 border-b border-term-border bg-term-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
          <div className="flex items-baseline gap-3">
            <span className="text-sm font-bold text-term-accent text-glow">
              admin
            </span>
            <span className="hidden text-xs text-term-dim sm:inline">
              editing {data.profile.username}@{data.profile.host}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-term-dim hover:text-term-accent"
            >
              view site ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-4 overflow-x-auto px-5 pb-2 text-xs text-term-dim">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="hover:text-term-accent">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-5 py-8">
        <p className="text-xs text-term-dim">
          Changes save per-section and publish to the live site immediately.
        </p>
        <ProfileForm initial={data.profile} />
        <SocialsForm initial={data.socials} />
        <ExperienceForm initial={data.experience} />
        <SkillsForm initial={data.skills} />
        <ProjectsForm initial={data.projects} />
        <EducationForm initial={data.education} />
      </main>
    </div>
  );
}
