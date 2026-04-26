import { AppShell } from "@/components/app-shell";
import { PlantCard } from "@/components/plant-card";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type AppPageProps = {
  searchParams: Promise<{
    archived?: string;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const [authState, { archived }] = await Promise.all([getAuthState(), searchParams]);

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

  const plantsResult = await listPlantsForUser(supabase, authState.user.id);
  const plants = plantsResult.data ?? [];

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Your plant collection"
      subtitle="Manual plant records live here first, before photos, reminders, or watering workflow automation."
      actions={<SignOutButton />}
    >
      <div className="flex flex-col gap-6">
        {archived === "1" ? (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <StatusPill tone="success">Plant archived</StatusPill>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">
              The plant is hidden from your default collection view and can stay out of the
              way without being hard-deleted.
            </p>
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Protected collection
              </p>
              <h2 className="mt-4 text-3xl font-semibold">Your plants stay tied to your account.</h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                Add and edit manual plant records here. This slice keeps the data model simple on
                purpose, so there are still no AI identifications, reminders, or watering events.
              </p>
            </div>

            <Link
              href="/app/plants/new"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Add a plant
            </Link>
          </div>
        </section>

        {plantsResult.error ? (
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill tone="warning">Collection unavailable</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">We couldn&apos;t load your plants</h2>
            <p className="mt-3 text-sm leading-7 text-amber-950/80 sm:text-base">
              {plantsResult.error}
            </p>
          </section>
        ) : null}

        {!plantsResult.error && plants.length === 0 ? (
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill>Empty collection</StatusPill>
            <h2 className="mt-5 text-3xl font-semibold">No plants yet, and that&apos;s okay.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Start with one manual plant record. No AI identification has happened here, no
              reminders have been scheduled, and any watering guidance you add stays editable later.
            </p>
            <div className="mt-6">
              <Link
                href="/app/plants/new"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Add your first plant
              </Link>
            </div>
          </section>
        ) : null}

        {!plantsResult.error && plants.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
