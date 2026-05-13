import Link from "next/link";
import { redirect } from "next/navigation";

import { completeOnboardingAction } from "@/app/app/onboarding/actions";
import { AppShell } from "@/components/app-shell";
import {
  CameraIcon,
  CheckCircleIcon,
  DropletIcon,
  PlusIcon,
  RoomIcon,
  SproutIcon,
} from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAppPreferencesForUser } from "@/lib/user-preferences/data";

type OnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
    review?: string;
    redirectTo?: string;
  }>;
};

const SUGGESTED_ROOMS = [
  "Living room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Balcony",
];

function OnboardingSubmitButton({
  redirectTo,
  children,
  variant = "primary",
}: {
  redirectTo: "/app" | "/app/plants/new" | "/app/plants/new?start=photo";
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
      : "inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]";

  return (
    <button type="submit" name="redirectTo" value={redirectTo} className={className}>
      {children}
    </button>
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

  const [preferencesResult, plantsResult, roomsResult] = await Promise.all([
    getUserAppPreferencesForUser(supabase, authState.user.id),
    listPlantsForUser(supabase, authState.user.id),
    listPlantRoomsForUser(supabase, authState.user.id),
  ]);
  const preferences = preferencesResult.data;
  const plants = plantsResult.data ?? [];
  const rooms = roomsResult.data ?? [];
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

        {params.error === "rooms" ? (
          <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4">
            <StatusPill tone="warning">Rooms not saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-amber-950/80">
              We could not save those rooms yet. You can skip setup or manage rooms from Settings.
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

        <form action={completeOnboardingAction} className="grid gap-6">
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
              Add rooms, start your first plant manually or with a photo, or head straight
              to Today. Every step is optional.
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <RoomIcon className="mt-1 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">Add rooms</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Rooms help organize plants later. Skip them now or choose a few names to
                  save to Settings.
                </p>

                {roomsResult.error ? (
                  <div className="mt-4 rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                    {roomsResult.error} You can still finish setup.
                  </div>
                ) : null}

                {rooms.length > 0 ? (
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    You already have {rooms.length} room{rooms.length === 1 ? "" : "s"}.
                    New names that match existing rooms will be skipped.
                  </p>
                ) : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {SUGGESTED_ROOMS.map((roomName) => (
                    <label key={roomName} className="cursor-pointer">
                      <input type="checkbox" name="roomName" value={roomName} className="peer sr-only" />
                      <span className="flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition peer-checked:border-[color:var(--accent)] peer-checked:bg-[color:var(--accent-soft)] hover:bg-[color:var(--accent-soft)]">
                        {roomName}
                      </span>
                    </label>
                  ))}
                </div>

                <label className="mt-5 flex flex-col gap-2 text-sm font-semibold">
                  Custom rooms
                  <input
                    name="customRoomNames"
                    placeholder="Sunroom, Patio"
                    className="min-h-[var(--tap-target)] rounded-[1rem] border border-[color:var(--border)] bg-white/80 px-4 py-3 text-base font-normal outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                  />
                  <span className="text-xs font-normal leading-5 text-[color:var(--muted)]">
                    Separate multiple room names with commas.
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <SproutIcon className="mt-1 h-5 w-5 shrink-0 text-[color:var(--accent)]" />
              <div>
                <h3 className="text-lg font-semibold">Choose your first plant path</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  Manual setup stays useful. Photo-first setup can add optional identity
                  suggestions before you save.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <OnboardingSubmitButton redirectTo="/app/plants/new">
                    <PlusIcon className="h-4 w-4" />
                    Add manually
                  </OnboardingSubmitButton>
                  <OnboardingSubmitButton redirectTo="/app/plants/new?start=photo" variant="secondary">
                    <CameraIcon className="h-4 w-4" />
                    Start with a photo
                  </OnboardingSubmitButton>
                  <OnboardingSubmitButton redirectTo="/app" variant="secondary">
                    <CheckCircleIcon className="h-4 w-4" />
                    Skip for now
                  </OnboardingSubmitButton>
                </div>
              </div>
            </div>
          </section>
        </form>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
            <RoomIcon className="h-6 w-6 text-[color:var(--accent)]" />
            <h3 className="mt-4 font-semibold">Rooms are optional</h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Keep plants unassigned for now or add room names above. You can manage rooms
              later in Settings.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
            <CameraIcon className="h-6 w-6 text-[color:var(--accent)]" />
            <h3 className="mt-4 font-semibold">Photos can wait</h3>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Start with a photo when it helps, or add the plant manually and add photos later.
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
