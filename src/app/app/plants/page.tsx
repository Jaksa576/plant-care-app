import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ChevronRightIcon, LeafIcon, PlusIcon } from "@/components/icons";
import { PlantPhotoFrame } from "@/components/plant-photo";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { createPlantPhotoUrlMap } from "@/lib/plants/photos";
import { getPlantPrimaryLabel, getPlantSecondaryLabel } from "@/lib/plants/presenters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PlantsPage() {
  const authState = await getAuthState();

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
  const photoUrls = await createPlantPhotoUrlMap(supabase, plants);

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="My plants"
      subtitle="The full collection view is ready for the redesign foundation; richer room chapters land in the Plants slice."
    >
      {plantsResult.error ? (
        <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5">
          <StatusPill tone="warning">Collection unavailable</StatusPill>
          <h2 className="mt-4 text-xl font-semibold">We couldn&apos;t load your plants</h2>
          <p className="mt-2 text-sm leading-6 text-amber-950/80">{plantsResult.error}</p>
        </section>
      ) : null}

      {!plantsResult.error && plants.length === 0 ? (
        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
            <LeafIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold">No plants yet</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
            Add your first plant to start building a personal watering-first collection.
          </p>
          <Link
            href="/app/plants/new"
            className="mt-5 inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            <PlusIcon className="h-4 w-4" />
            Add plant
          </Link>
        </section>
      ) : null}

      {!plantsResult.error && plants.length > 0 ? (
        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)]">
          <div className="flex items-center justify-between border-b border-[color:var(--border-soft)] px-5 py-4">
            <h2 className="text-lg font-semibold">Collection</h2>
            <span className="rounded-full bg-[color:var(--stone)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
              {plants.length}
            </span>
          </div>

          <div className="divide-y divide-[color:var(--border-soft)]">
            {plants.map((plant) => {
              const primaryLabel = getPlantPrimaryLabel(plant);
              const secondaryLabel = getPlantSecondaryLabel(plant);

              return (
                <Link
                  key={plant.id}
                  href={`/app/plants/${plant.id}`}
                  className="flex min-h-[var(--tap-target)] items-center gap-3 px-5 py-4 transition hover:bg-[color:var(--stone)]"
                >
                  <PlantPhotoFrame
                    photoUrl={photoUrls[plant.id]}
                    alt={`${primaryLabel} photo`}
                    variant="thumbnail"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">{primaryLabel}</h3>
                    <p className="mt-1 truncate text-sm text-[color:var(--muted)]">
                      {secondaryLabel ?? plant.location ?? "Unassigned"}
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-[color:var(--muted)]" />
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
