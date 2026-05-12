import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth-form";
import { DropletIcon, LeafIcon, RoomIcon } from "@/components/icons";
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
    <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[color:var(--background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-7 shadow-[var(--shadow)] sm:p-9">
          <div
            aria-hidden="true"
            className="absolute -top-16 right-0 h-48 w-48 rounded-full bg-[color:var(--accent-soft)] sm:-right-16"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-8 right-10 hidden h-28 w-28 rounded-full bg-[color:var(--clay)]/70 sm:block"
          />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Plant Care home">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-strong)] ring-1 ring-[color:var(--border-soft)]">
                <Image
                  src="/brand/plant-care-approved-icon-square-1024.png"
                  alt=""
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
              <span className="text-base font-bold text-[color:var(--accent-ink)]">
                Plant Care
              </span>
            </Link>

            <h2 className="mt-10 max-w-lg text-4xl font-semibold leading-tight sm:text-5xl">
              Your plant log starts here.
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-[color:var(--muted)]">
              Sign in or create an account to track watering, rooms, photos, and simple
              notes.
            </p>

            <div className="mt-8 grid gap-3 text-sm font-semibold text-[color:var(--accent-ink)] sm:grid-cols-3">
              <div className="flex items-center gap-2 border-t border-[color:var(--border-soft)] pt-3">
                <DropletIcon className="h-5 w-5" />
                Watering
              </div>
              <div className="flex items-center gap-2 border-t border-[color:var(--border-soft)] pt-3">
                <RoomIcon className="h-5 w-5" />
                Rooms
              </div>
              <div className="flex items-center gap-2 border-t border-[color:var(--border-soft)] pt-3">
                <LeafIcon className="h-5 w-5" />
                Notes
              </div>
            </div>

            <Link
              href="/"
              className="mt-10 inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
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
