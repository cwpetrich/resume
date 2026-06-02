"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded border border-term-accent bg-term-accent/10 px-4 py-2 text-sm font-semibold text-term-accent transition-colors hover:bg-term-accent/20 disabled:opacity-50"
    >
      {pending ? "authenticating…" : "login"}
    </button>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <span className="mb-1 block text-xs text-term-dim">username</span>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full rounded border border-term-border bg-black/30 px-3 py-2 text-sm text-term-fg outline-none focus:border-term-accent"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs text-term-dim">password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded border border-term-border bg-black/30 px-3 py-2 text-sm text-term-fg outline-none focus:border-term-accent"
        />
      </label>

      {state.error && (
        <p className="text-xs text-red-400" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
