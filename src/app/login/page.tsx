import Link from "next/link";

import { StatusPill } from "@/components/status-pill";

export default function LoginPlaceholderPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-[var(--shadow)] backdrop-blur sm:p-8">
        <StatusPill tone="warning">Auth slice pending</StatusPill>
        <h1 className="mt-5 text-3xl font-semibold">Login flow is not implemented yet.</h1>
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          This page exists to make the intended product shape obvious. In the next slice,
          it can become the entry point for Supabase Auth with route protection and a
          proper signed-in experience.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to landing page
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold"
          >
            View app placeholder
          </Link>
        </div>
      </div>
    </main>
  );
}
