import type { Project } from "@/lib/data";
import { externalUrl } from "@/lib/url";
import Section from "./Section";
import Tag from "./Tag";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section id="projects" command="ls projects/">
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.slug}
            className="group flex flex-col rounded-lg border border-term-border bg-term-panel p-5 transition-colors hover:border-term-accent/60 print-break"
          >
            <div className="flex items-baseline gap-2">
              <span className="select-none text-term-accent">▸</span>
              <h3 className="font-semibold text-term-fg group-hover:text-term-accent">
                {p.name}/
              </h3>
            </div>

            <p className="mt-2 flex-1 text-sm leading-relaxed text-term-dim">
              {p.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>

            {(p.href || p.repo) && (
              <div className="mt-4 flex gap-4 text-xs">
                {p.href && (
                  <a
                    href={externalUrl(p.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-term-accent hover:underline"
                  >
                    live →
                  </a>
                )}
                {p.repo && (
                  <a
                    href={externalUrl(p.repo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-term-accent hover:underline"
                  >
                    source →
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}
