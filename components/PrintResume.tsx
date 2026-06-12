import type { ResumeData, SocialLink } from "@/lib/data";

/**
 * Clean, single-column, black-on-white résumé. Hidden on screen (`.print-only`)
 * and revealed only by the print stylesheet when the visitor clicks
 * "download résumé (.pdf)" / hits Ctrl-P. Keeping a separate print layout means
 * the on-screen terminal aesthetic never has to compromise PDF readability.
 *
 * Typography/color for this layout live in the `@media print` block of
 * globals.css (proportional font, single dark-green accent on headings).
 */

/** Web links print as a readable bare URL; everything else (tel:) as the handle. */
function contactText(s: SocialLink): string {
  return /^https?:\/\//.test(s.href)
    ? s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
    : s.handle;
}

export default function PrintResume({ data }: { data: ResumeData }) {
  const { profile, socials, experience, skills, projects, education } = data;
  return (
    <div className="print-only mx-auto max-w-3xl text-black">
      {/* Header */}
      <header className="border-b border-black pb-2">
        <h1 className="font-mono text-2xl font-bold">{profile.name}</h1>
        <p className="text-base">{profile.title}</p>
        <p className="mt-1 text-xs">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          {socials.map((s) => (
            <span key={s.label}>
              {" · "}
              <a href={s.href}>{contactText(s)}</a>
            </span>
          ))}
          {` · ${profile.location}`}
        </p>
        <p className="mt-1 text-xs">
          Full résumé, projects, and an interactive terminal at{" "}
          <a href={`https://${profile.host}`} className="font-semibold">
            {profile.host}
          </a>
        </p>
      </header>

      {/* Summary */}
      <section className="mt-2">
        <p className="text-sm">{profile.tagline}</p>
      </section>

      {/* Experience */}
      <section className="mt-2">
        <h2 className="border-b border-black/30 text-sm font-bold uppercase tracking-wide">
          Experience
        </h2>
        {experience.map((j, i) => {
          // Older roles described by a single bullet collapse to one line so
          // the PDF stays on one page — the full history lives on the site.
          const compact = i >= 3 && j.highlights.length <= 1;
          return compact ? (
            <div
              key={j.company + j.role}
              className="print-break mt-1.5 flex justify-between gap-4 text-sm"
            >
              <span>
                <span className="font-semibold">
                  {j.role} — {j.company}
                </span>
                {" · "}
                {j.summary.replace(/\.$/, "")}
              </span>
              <span className="whitespace-nowrap">{j.period}</span>
            </div>
          ) : (
            <div key={j.company + j.role} className="print-break mt-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="font-semibold">
                  {j.role} — {j.company}
                </span>
                <span className="whitespace-nowrap">{j.period}</span>
              </div>
              <p className="text-xs italic">
                {j.location} · {j.summary}
              </p>
              <ul className="ml-4 list-disc">
                {j.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Skills */}
      <section className="print-break mt-2">
        <h2 className="border-b border-black/30 text-sm font-bold uppercase tracking-wide">
          Skills
        </h2>
        <ul className="mt-1 text-sm">
          {skills.map((g) => (
            <li key={g.label}>
              <span className="font-semibold">{g.label}:</span>{" "}
              {g.items.join(", ")}
            </li>
          ))}
        </ul>
      </section>

      {/* Projects */}
      <section className="mt-2">
        <h2 className="border-b border-black/30 text-sm font-bold uppercase tracking-wide">
          Projects
        </h2>
        {projects.map((p) => (
          <div key={p.slug} className="print-break mt-1 text-sm">
            <span className="font-semibold">{p.name}</span> —{" "}
            {p.slug === "resume"
              ? `this résumé's online home (${profile.host}): an interactive ` +
                "terminal-themed Next.js app with a database-backed admin " +
                "panel, self-hosted on my own hardware."
              : p.description}{" "}
            <span className="text-xs italic">({p.stack.join(", ")})</span>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="print-break mt-2">
        <h2 className="border-b border-black/30 text-sm font-bold uppercase tracking-wide">
          Education
        </h2>
        {education.map((e) => (
          <div key={e.school} className="mt-1 flex justify-between text-sm">
            <span>
              <span className="font-semibold">{e.credential}</span> — {e.school}
            </span>
            <span>{e.period}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
