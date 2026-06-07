"use client";

import { ReactNode, useState, useTransition } from "react";
import type { SaveResult } from "@/app/admin/actions";

/* Shared input styling. */
const inputCls =
  "w-full rounded border border-term-border bg-black/30 px-3 py-2 text-sm text-term-fg outline-none focus:border-term-accent";

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-term-dim">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-term-dim">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls + " resize-y"}
      />
    </label>
  );
}

/** Editor for a list of plain strings (bullets, tags, paragraphs). */
export function StringList({
  label,
  values,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const set = (i: number, v: string) =>
    onChange(values.map((x, j) => (j === i ? v : x)));
  return (
    <div>
      <span className="mb-1 block text-xs text-term-dim">{label}</span>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            {multiline ? (
              <textarea
                value={v}
                rows={2}
                placeholder={placeholder}
                onChange={(e) => set(i, e.target.value)}
                className={inputCls + " resize-y"}
              />
            ) : (
              <input
                value={v}
                placeholder={placeholder}
                onChange={(e) => set(i, e.target.value)}
                className={inputCls}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="shrink-0 rounded border border-term-border px-2 text-xs text-term-dim hover:border-red-400 hover:text-red-400"
              aria-label="remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="text-xs text-term-accent hover:underline"
        >
          + add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

/** Generic ordered-list editor with add / remove / move controls. */
export function ListEditor<T>({
  items,
  onChange,
  blank,
  render,
  addLabel,
  titleOf,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  titleOf: (item: T, index: number) => string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-term-border bg-black/20 p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-xs font-semibold text-term-accent">
              {titleOf(item, i) || `item ${i + 1}`}
            </span>
            <div className="flex shrink-0 gap-1 text-xs">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded border border-term-border px-2 py-0.5 text-term-dim hover:text-term-accent disabled:opacity-30"
                aria-label="move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                className="rounded border border-term-border px-2 py-0.5 text-term-dim hover:text-term-accent disabled:opacity-30"
                aria-label="move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="rounded border border-term-border px-2 py-0.5 text-term-dim hover:border-red-400 hover:text-red-400"
                aria-label="remove"
              >
                ✕ remove
              </button>
            </div>
          </div>
          <div className="space-y-3">{render(item, (patch) => update(i, patch))}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="rounded border border-dashed border-term-border px-3 py-2 text-xs text-term-accent hover:border-term-accent"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/** A card wrapping one editable section, with its own save button + status. */
export function SectionCard<T>({
  id,
  title,
  hint,
  value,
  onSave,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  value: T;
  onSave: (value: T) => Promise<SaveResult>;
  children: ReactNode;
}) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState<null | "ok" | string>(null);

  const save = () => {
    setStatus(null);
    start(async () => {
      const res = await onSave(value);
      setStatus(res.ok ? "ok" : res.error || "save failed");
    });
  };

  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-lg border border-term-border bg-term-panel p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-term-fg">{title}</h2>
          {hint && <p className="text-xs text-term-dim">{hint}</p>}
        </div>
        <div className="flex items-center gap-3">
          {status === "ok" && (
            <span className="text-xs text-term-accent">✓ saved</span>
          )}
          {status && status !== "ok" && (
            <span className="text-xs text-red-400">{status}</span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded border border-term-accent bg-term-accent/10 px-4 py-1.5 text-sm font-semibold text-term-accent transition-colors hover:bg-term-accent/20 disabled:opacity-50"
          >
            {pending ? "saving…" : "save"}
          </button>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
