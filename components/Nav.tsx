import { profile } from "@/lib/data";

const links = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#contact", label: "contact" },
];

/** Sticky top nav, styled as a shell path bar. */
export default function Nav() {
  return (
    <nav className="no-print sticky top-0 z-30 border-b border-term-border bg-term-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3 text-xs sm:text-sm">
        <a href="#top" className="font-bold text-term-accent text-glow">
          {profile.username}@{profile.host}
        </a>
        <ul className="hidden gap-5 text-term-dim sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="transition-colors hover:text-term-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
