import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    missingEnv?: string;
    signedOut?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ missingEnv, signedOut }, authState] = await Promise.all([
    searchParams,
    getAuthState(),
  ]);

  if (authState.user) {
    redirect("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="flex w-full max-w-5xl flex-col gap-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-7 shadow-[var(--shadow)] sm:p-8">
          <StatusPill tone={authState.supabaseConfigured ? "success" : "warning"}>
            {authState.supabaseConfigured ? "Signed-in access" : "Local setup"}
          </StatusPill>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Plant Care App
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            A calm front door for the real app.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            Sign in to reach your protected plant collection, where manual records now live
            before photos, reminders, and watering workflow automation.
          </p>

          <div className="mt-8 rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              What happens next
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[color:var(--muted)]">
              <li>Your account owns every plant record in the protected app.</li>
              <li>Manual plant setup is available right after sign-in.</li>
              <li>Watering workflows, reminders, and AI stay out of this slice.</li>
            </ul>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            >
              Back to landing page
            </Link>
          </div>
        </section>

        <AuthForm
          supabaseConfigured={authState.supabaseConfigured}
          showSignedOutMessage={signedOut === "1"}
          showMissingEnvMessage={missingEnv === "1"}
        />
      </div>
    </main>
  );
}
