import type { Profile } from "@/lib/data";
import DownloadResume from "./DownloadResume";

/**
 * Hero: a faux terminal window running `whoami`, with the headline, tagline,
 * quick stats, and the primary call-to-action buttons.
 */
export default function Hero({ profile }: { profile: Profile }) {
  return (
    <header className="pt-6">
      <div className="scanlines animate-flicker overflow-hidden rounded-lg border border-term-border bg-term-panel shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-term-border bg-black/30 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 truncate text-xs text-term-dim">
            {profile.username}@{profile.host}: ~
          </span>
        </div>

        {/* Window body */}
        <div className="space-y-4 p-5 sm:p-8">
          <p className="text-sm text-term-dim">
            <span className="text-term-accent text-glow">
              {profile.username}@{profile.host}
            </span>
            :<span className="text-sky-400">~</span>${" "}
            <span className="text-term-fg">whoami</span>
          </p>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-term-fg sm:text-5xl">
              {profile.name}
            </h1>
            <p className="text-lg font-semibold text-term-accent text-glow sm:text-2xl">
              {profile.title}
            </p>
            <p className="max-w-2xl text-balance text-sm leading-relaxed text-term-dim sm:text-base">
              {profile.tagline}
            </p>
          </div>

          {/* Quick stats */}
          <ul className="flex flex-wrap gap-x-8 gap-y-2 pt-1 text-sm">
            {profile.stats.map((s) => (
              <li key={s.label}>
                <span className="font-bold text-term-accent">{s.value}</span>{" "}
                <span className="text-term-dim">{s.label}</span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-3">
            <DownloadResume pdfTitle={`${profile.name} — Résumé`} />
            <a
              href="#contact"
              className="rounded border border-term-border px-4 py-2 text-sm text-term-fg transition-colors hover:border-term-accent hover:text-term-accent"
            >
              ./contact.sh
            </a>
            <a
              href="#projects"
              className="rounded border border-term-border px-4 py-2 text-sm text-term-fg transition-colors hover:border-term-accent hover:text-term-accent"
            >
              ls projects/
            </a>
          </div>

          <p className="pt-2 text-xs text-term-dim/70">
            <span className="text-term-accent">tip:</span> scroll down for the
            full résumé, or scroll to the bottom for an interactive terminal.
            There are a few things hidden in here — try the{" "}
            <span className="text-term-fg">↑ ↑ ↓ ↓ ← → ← → B A</span> code.
          </p>
        </div>
      </div>
    </header>
  );
}
