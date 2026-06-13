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

/**
 * How many of the most-recent roles get the full bullet treatment. Anything
 * older collapses into a single "earlier roles" line that points to the site
 * for the complete history — keeps the page focused on recent work.
 */
const FULL_ROLE_COUNT = 5;

export default function PrintResume({ data }: { data: ResumeData }) {
  const { profile, socials, experience, skills, education } = data;
  const recentRoles = experience.slice(0, FULL_ROLE_COUNT);
  const earlierRoles = experience.slice(FULL_ROLE_COUNT);
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
        {recentRoles.map((j) => (
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
        ))}
        {earlierRoles.length > 0 && (
          <p className="mt-1.5 text-sm">
            <span className="font-semibold">Earlier roles:</span>{" "}
            {earlierRoles
              .map((j) => `${j.role}, ${j.company} (${j.period})`)
              .join("; ")}
            . Full history at{" "}
            <a href={`https://${profile.host}`} className="font-semibold">
              {profile.host}
            </a>
            .
          </p>
        )}
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
