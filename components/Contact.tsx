import type { Profile, SocialLink } from "@/lib/data";
import Section from "./Section";

export default function Contact({
  profile,
  socials,
}: {
  profile: Profile;
  socials: SocialLink[];
}) {
  // Email lives on the profile; surface it as the first contact row.
  const rows: SocialLink[] = [
    { label: "Email", handle: profile.email, href: `mailto:${profile.email}` },
    ...socials,
  ];
  return (
    <Section id="contact" command="./contact.sh">
      <p className="mb-5 max-w-xl text-sm leading-relaxed text-term-dim">
        Open to interesting work and conversations. The fastest way to reach me
        is email — or find me on the links below.
      </p>

      <ul className="space-y-2.5">
        {rows.map((s) => (
          <li key={s.label} className="flex items-center gap-3 text-sm">
            <span className="w-20 shrink-0 text-term-dim">{s.label}</span>
            <a
              href={s.href}
              target={s.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-term-accent transition-colors hover:text-term-fg hover:underline"
            >
              {s.handle}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-term-dim/70">
        {/* The "exit code" sign-off — a little terminal flavor. */}
        <span className="text-term-accent">{profile.username}@{profile.host}</span>
        :~$ logout
        <br />
        <span className="text-term-dim">
          [Process completed — thanks for visiting]
        </span>
      </p>
    </Section>
  );
}
