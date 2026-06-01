import { ReactNode } from "react";

interface SectionProps {
  /** Anchor id used by nav links and the interactive terminal. */
  id: string;
  /** The faux shell command shown as the section heading, e.g. "cat about.md". */
  command: string;
  children: ReactNode;
}

/**
 * A page section framed like terminal output: a `$ command` heading followed
 * by the rendered "result".
 */
export default function Section({ id, command, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-10 print-break">
      <h2 className="mb-6 flex items-baseline gap-2 font-mono text-sm sm:text-base">
        <span className="select-none text-term-accent text-glow">$</span>
        <span className="text-term-dim">{command}</span>
      </h2>
      <div className="pl-4 sm:pl-6">{children}</div>
    </section>
  );
}
