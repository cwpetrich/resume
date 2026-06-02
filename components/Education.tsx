import type { SchoolEntry } from "@/lib/data";
import Section from "./Section";

export default function Education({
  education,
}: {
  education: SchoolEntry[];
}) {
  return (
    <Section id="education" command="cat education.md">
      <ul className="space-y-4">
        {education.map((e) => (
          <li
            key={e.school + e.credential}
            className="flex flex-wrap items-baseline justify-between gap-x-4 print-break"
          >
            <div>
              <h3 className="text-base font-semibold text-term-fg">
                {e.credential}
              </h3>
              <p className="text-sm text-term-accent">{e.school}</p>
              {e.detail && (
                <p className="mt-0.5 text-xs text-term-dim">{e.detail}</p>
              )}
            </div>
            <span className="text-xs text-term-dim">{e.period}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
