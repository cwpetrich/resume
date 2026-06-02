import type { Profile } from "@/lib/data";
import Section from "./Section";

export default function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about" command="cat about.md">
      <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-term-fg/90 sm:text-base">
        {profile.about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="text-xs text-term-dim">
          {profile.location}
        </p>
      </div>
    </Section>
  );
}
