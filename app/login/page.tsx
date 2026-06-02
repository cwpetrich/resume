import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { getResumeData } from "@/lib/resume";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Login", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  // Already authenticated → straight to the panel.
  if (await getCurrentSession()) redirect("/admin");

  const { profile } = getResumeData();
  const next = searchParams.next || "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="scanlines overflow-hidden rounded-lg border border-term-border bg-term-panel shadow-2xl">
          <div className="flex items-center gap-2 border-b border-term-border bg-black/30 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-2 text-xs text-term-dim">
              {profile.username}@{profile.host}: ~/admin · sudo login
            </span>
          </div>
          <div className="space-y-5 p-6">
            <p className="text-sm text-term-dim">
              <span className="text-term-accent">$</span> authenticate to edit
              the résumé
            </p>
            <LoginForm next={next} />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-term-dim">
          <Link href="/" className="hover:text-term-accent">
            ← back to résumé
          </Link>
        </p>
      </div>
    </main>
  );
}
