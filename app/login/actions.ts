"use server";

import { redirect } from "next/navigation";
import { checkCredentials, startSession } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

/** Server action for the login form (used with useFormState). */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (!checkCredentials(username, password)) {
    return { error: "Invalid username or password." };
  }

  await startSession(username);
  // Only allow same-site relative redirects.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}
