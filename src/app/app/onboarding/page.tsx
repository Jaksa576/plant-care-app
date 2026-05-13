import Link from "next/link";
import { redirect } from "next/navigation";

import { completeOnboardingAction } from "@/app/app/onboarding/actions";
import { AppShell } from "@/components/app-shell";
import { CameraIcon, CheckCircleIcon, DropletIcon, PlusIcon, RoomIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAppPreferencesForUser } from "@/lib/user-preferences/data";

type OnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
    review?: string;
    redirectTo?: string;
  }>;
};

function OnboardingChoiceForm({
  redirectTo,
  children,
  variant = "primary",
}: {
  redirectTo: "/app" | "/app/plants/new";
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
      : "inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]";

  return (
    <form action={completeOnboardingAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [authState, params] = await Promise.all([getAuthState(), searchParams]);

  if (!authState.supabaseConfigured) {
    redirect("/login?missingEnv=1");
  }

  if (!authState.user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?missingEnv=1");
  }

  const [preferencesResult, plantsResult] = await Promise.all([
    getUserAppPreferencesForUser(supabase, authState.user.id),
    listPlantsForUser(supabase, authState.user.id),
  ]);
  const preferences = preferencesResult.data;
  const plants = plantsResult.data ?? [];
  const isReview = params.review === "1";

  if (!isReview && preferences?.onboarding_completed_at) {
    redirect("/app");
  }

  if (!isReview && !preferences?.onboarding_completed_at && plants.length > 0) {
    redirect("/app");
  }

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Set up Plant Care"
      subtitle="Add rooms, start your first plant, or skip and come back later."
      actions={<SignOutButton />}
      showAddPlantAction={false}
    >
      <div className="grid gap-6">
        {params.error === "save" ? (
          <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4">
            <StatusPill tone="warning">Setup not saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-amber-950/80">
              We could not save onboarding completion yet. You can try again or open Today.
            </p>
          </section>
        ) : null}

        {preferencesResult.error ? (
          <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4">
            <StatusPill tone="warning">Setup state unavailable</StatusPill>
            <p className="mt-3 text-sm leading-7 text-amber-950/80">
              {preferencesResult.error} You can still use Plant Care normally.
            </p>
          </section>
        ) : null}

        <section className="rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-6 sm:p-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <DropletIcon className="h-7 w-7" />
          </span>
          <div className="mt-5">
            <StatusPill>Optional setup</StatusPill>
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight">
            Let&apos;s set up your plant care space.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            Plant Care works best when it can help you remember watering. Start with a
            plant, make space for rooms later, or head straight to Today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <OnboardingChoiceForm redirectTo="/app/plants/new">
              <PlusIcon className="h-4 w-4" />
              Add first plant
            </OnboardingChoiceForm>
            <OnboardingChoiceForm redirectTo="/app" variant="secondary">
              <CheckCircleIcon className="h-4 w-4" />
              Skip for now
            </OnboardingChoiceForm>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
            <RoomIcon className="h-6 w-6 text-[color:var(--accent)]" />
            <h3 className="mt-4 font-semibold">Rooms are optional</h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Keep plants unassigned for now. Managed rooms arrive in the next slices.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
            <CameraIcon className="h-6 w-6 text-[color:var(--accent)]" />
            <h3 className="mt-4 font-semibold">Photos can wait</h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Add a plant manually first. Photo-first setup stays optional.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
            <DropletIcon className="h-6 w-6 text-[color:var(--accent)]" />
            <h3 className="mt-4 font-semibold">Watering stays first</h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Reminders and calendar sync reflect Plant Care. They do not own your care.
            </p>
          </div>
        </section>

        {isReview ? (
          <div>
            <Link
              href="/app/settings"
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            >
              Back to Settings
            </Link>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
