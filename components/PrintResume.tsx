import {
  profile,
  email,
  socials,
  experience,
  skills,
  projects,
  education,
} from "@/lib/data";

/**
 * Clean, single-column, black-on-white résumé. Hidden on screen (`.print-only`)
 * and revealed only by the print stylesheet when the visitor clicks
 * "download résumé (.pdf)" / hits Ctrl-P. Keeping a separate print layout means
 * the on-screen terminal aesthetic never has to compromise PDF readability.
 */
export default function PrintResume() {
  return (
    <div className="print-only mx-auto max-w-3xl px-8 py-6 text-black">
      {/* Header */}
      <header className="border-b border-black pb-3">
        <h1 className="text-2xl font-bold">{profile.name}</h1>
        <p className="text-base">{profile.title}</p>
        <p className="mt-1 text-xs">
          {email}
          {socials
            .filter((s) => s.label !== "Email")
            .map((s) => ` · ${s.href.replace(/^https?:\/\//, "")}`)}
          {` · ${profile.location}`}
        </p>
      </header>

      {/* Summary */}
      <section className="mt-4">
        <p className="text-sm">{profile.tagline}</p>
      </section>

      {/* Experience */}
      <section className="mt-4">
        <h2 className="border-b border-black/30 text-sm font-bold uppercase tracking-wide">
          Experience
        </h2>
        {experience.map((j) => (
          <div key={j.company + j.role} className="mt-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">
                {j.role} — {j.company}
              </span>
              <span>{j.period}</span>
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
      </section>

      {/* Skills */}
      <section className="mt-4">
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
      <section className="mt-4">
        <h2 className="border-b border-black/30 text-sm font-bold uppercase tracking-wide">
          Projects
        </h2>
        {projects.map((p) => (
          <div key={p.slug} className="mt-1 text-sm">
            <span className="font-semibold">{p.name}</span> — {p.description}{" "}
            <span className="text-xs italic">({p.stack.join(", ")})</span>
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mt-4">
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
