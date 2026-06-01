import { experience } from "@/lib/data";
import Section from "./Section";
import Tag from "./Tag";

export default function Experience() {
  return (
    <Section id="experience" command="cat experience.log">
      <ol className="space-y-8 border-l border-term-border pl-6">
        {experience.map((job) => (
          <li key={job.company + job.role} className="relative print-break">
            {/* Timeline node */}
            <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-term-accent bg-term-bg" />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-base font-semibold text-term-fg sm:text-lg">
                {job.role}{" "}
                <span className="text-term-accent">@ {job.company}</span>
              </h3>
              <span className="text-xs text-term-dim">{job.period}</span>
            </div>

            <p className="mt-0.5 text-xs text-term-dim">
              {job.location} · {job.summary}
            </p>

            <ul className="mt-3 space-y-1.5 text-sm text-term-fg/90">
              {job.highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="select-none text-term-accent">▸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.stack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
