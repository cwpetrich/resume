import type { SkillGroup } from "@/lib/data";
import Section from "./Section";

export default function Skills({ skills }: { skills: SkillGroup[] }) {
  return (
    <Section id="skills" command="cat skills.txt">
      <div className="grid gap-5 sm:grid-cols-2">
        {skills.map((group) => (
          <div key={group.label} className="print-break">
            <h3 className="mb-2 text-sm font-semibold text-term-accent">
              {group.label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded border border-term-border bg-term-panel px-2.5 py-1 text-xs text-term-fg transition-colors hover:border-term-accent hover:text-term-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
