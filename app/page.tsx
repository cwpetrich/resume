import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import PrintResume from "@/components/PrintResume";
import { getResumeData } from "@/lib/resume";

// Render from the live database on each request so admin edits appear instantly.
export const dynamic = "force-dynamic";

export default function Home() {
  const data = getResumeData();
  const { profile, socials, experience, skills, projects, education } = data;

  return (
    <>
      <Nav profile={profile} />

      <main id="top" className="no-print mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <Hero profile={profile} />
        <About profile={profile} />
        <Experience experience={experience} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Education education={education} />

        {/* Interactive terminal — the centerpiece "play" section. */}
        <section id="terminal" className="no-print scroll-mt-24 py-10">
          <h2 className="mb-6 flex items-baseline gap-2 text-sm sm:text-base">
            <span className="select-none text-term-accent text-glow">$</span>
            <span className="text-term-dim">./play.sh</span>
          </h2>
          <div className="pl-4 sm:pl-6">
            <p className="mb-4 max-w-2xl text-sm text-term-dim">
              A real, working shell. Type{" "}
              <span className="text-term-accent">help</span> to start — but not
              every command is listed there. Built the same way the rest of this
              site was: React, hand-rolled.
            </p>
            <InteractiveTerminal data={data} />
          </div>
        </section>

        <Contact profile={profile} socials={socials} />

        <footer className="no-print mt-10 border-t border-term-border pt-6 text-xs text-term-dim">
          <p>
            Built with Next.js + Tailwind by {profile.name}. Self-hosted on bare
            metal. <span className="text-term-accent">View source</span> on{" "}
            <a
              href="https://github.com/cwpetrich/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-accent hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </footer>
      </main>

      {/* Clean résumé that only appears when printing to PDF. */}
      <PrintResume data={data} />
    </>
  );
}
