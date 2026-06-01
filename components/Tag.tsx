import { ReactNode } from "react";

/** A small monospace pill used for tech-stack tags. */
export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-term-border bg-black/30 px-2 py-0.5 text-xs text-term-dim">
      {children}
    </span>
  );
}
