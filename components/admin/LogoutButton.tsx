"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/admin/actions";

export default function LogoutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      onClick={() => start(() => logoutAction())}
      disabled={pending}
      className="rounded border border-term-border px-3 py-1.5 text-xs text-term-dim transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-50"
    >
      {pending ? "…" : "logout"}
    </button>
  );
}
