import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import { getResumeData, getTailoredResume } from "@/lib/resume";
import ResumeDocument from "@/components/ResumeDocument";
import DownloadResume from "@/components/DownloadResume";

export const metadata = { title: "Tailored résumé", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function TailoredResumePage({
  params,
}: {
  params: { id: string };
}) {
  if (!(await getCurrentSession())) redirect("/login");

  const record = getTailoredResume(params.id);
  if (!record) notFound();

  const data = getResumeData();

  return (
    <div className="min-h-screen bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-term-border bg-term-bg px-5 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/admin#tailor"
              className="text-xs text-term-dim hover:text-term-accent"
            >
              ← back to admin
            </Link>
            <p className="truncate text-sm font-semibold text-term-fg">
              {record.label}
            </p>
          </div>
          <DownloadResume
            pdfTitle={`${data.profile.name} — ${record.label} — Résumé`}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 font-sans text-black">
        <ResumeDocument
          profile={data.profile}
          socials={data.socials}
          education={data.education}
          summary={record.summary}
          skills={record.skills}
          experience={record.experience}
        />
      </div>

      <div className="no-print mx-auto max-w-3xl border-t border-term-border px-6 py-6">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-term-dim">
          Job description this was tailored to
        </h2>
        <pre className="whitespace-pre-wrap rounded border border-term-border bg-term-panel p-4 text-xs text-term-fg">
          {record.jobDescription}
        </pre>
      </div>
    </div>
  );
}
