import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ChevronRightIcon, LeafIcon, PlusIcon, RoomIcon } from "@/components/icons";
import { PlantPhotoFrame } from "@/components/plant-photo";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { createPlantPhotoUrlMap } from "@/lib/plants/photos";
import { getPlantPrimaryLabel, getPlantSecondaryLabel } from "@/lib/plants/presenters";
import { listWateringRemindersForUser } from "@/lib/reminders/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDashboardPlants, type DashboardPlant } from "@/lib/watering/dashboard";
import { listWateringEventsForUser } from "@/lib/watering/data";

function getStatusClass(status: DashboardPlant["schedule"]["status"]) {
  if (status === "overdue") {
    return "text-[color:var(--attention)]";
  }

  if (status === "due-today" || status === "not-watered") {
    return "text-[#c66b20]";
  }

  if (status === "upcoming") {
    return "text-[color:var(--accent-ink)]";
  }

  return "text-[color:var(--muted)]";
}

function groupDashboardPlantsByRoom(items: DashboardPlant[]) {
  const groups = new Map<string, DashboardPlant[]>();

  for (const item of items) {
    const room = item.plant.location?.trim() || "Unassigned";
    const roomItems = groups.get(room) ?? [];
    roomItems.push(item);
    groups.set(room, roomItems);
  }

  return [...groups.entries()].sort(([roomA], [roomB]) => {
    if (roomA === "Unassigned") {
      return 1;
    }

    if (roomB === "Unassigned") {
      return -1;
    }

    return roomA.localeCompare(roomB);
  });
}

function PlantCollectionRow({
  item,
  photoUrl,
}: {
  item: DashboardPlant;
  photoUrl?: string;
}) {
  const primaryLabel = getPlantPrimaryLabel(item.plant);
  const secondaryLabel = getPlantSecondaryLabel(item.plant);
  const roomLabel = item.plant.location?.trim() || "Unassigned";
  const statusClass = getStatusClass(item.schedule.status);

  return (
    <Link
      href={`/app/plants/${item.plant.id}`}
      className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-[color:var(--border-soft)] py-4 transition last:border-b-0 hover:bg-[color:var(--stone)] sm:px-2"
    >
      <PlantPhotoFrame
        photoUrl={photoUrl}
        alt={photoUrl ? `${primaryLabel} primary plant photo` : ""}
        variant="thumbnail"
      />
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold">{primaryLabel}</h3>
        <p className="mt-1 truncate text-sm leading-5 text-[color:var(--muted)]">
          {secondaryLabel ?? roomLabel}
        </p>
        <p className="mt-0.5 text-sm leading-5 text-[color:var(--muted)]">
          {item.schedule.lastWateredLabel}
        </p>
        <p className={`mt-0.5 text-sm font-semibold leading-5 ${statusClass}`}>
          {item.schedule.nextWateringLabel}
        </p>
      </div>
      <ChevronRightIcon className="mt-5 h-5 w-5 text-[color:var(--muted)]" />
    </Link>
  );
}

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

  const [plantsResult, wateringEventsResult, remindersResult] = await Promise.all([
    listPlantsForUser(supabase, authState.user.id),
    listWateringEventsForUser(supabase, authState.user.id),
    listWateringRemindersForUser(supabase, authState.user.id),
  ]);
  const plants = plantsResult.data ?? [];
  const photoUrls = await createPlantPhotoUrlMap(supabase, plants);
  const dashboardPlants = getDashboardPlants(
    plants,
    wateringEventsResult.data ?? [],
    remindersResult.data ?? [],
  );
  const roomGroups = groupDashboardPlantsByRoom(dashboardPlants);
  const unassignedCount = roomGroups.find(([room]) => room === "Unassigned")?.[1].length ?? 0;

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="My plants"
      subtitle="Your full active collection, grouped by room when rooms are available."
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white">
          All {plants.length}
        </span>
        {roomGroups.length > 1 ? (
          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
            By room
          </span>
        ) : null}
        {unassignedCount > 0 ? (
          <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
            Unassigned {unassignedCount}
          </span>
        ) : null}
      </div>

      {plantsResult.error ? (
        <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5">
          <StatusPill tone="warning">Collection unavailable</StatusPill>
          <h2 className="mt-4 text-xl font-semibold">We couldn&apos;t load your plants</h2>
          <p className="mt-2 text-sm leading-6 text-amber-950/80">{plantsResult.error}</p>
        </section>
      ) : null}

      {!plantsResult.error && wateringEventsResult.error ? (
        <section className="mb-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5">
          <StatusPill tone="warning">Watering state unavailable</StatusPill>
          <p className="mt-3 text-sm leading-6 text-amber-950/80">
            The collection is visible, but watering labels may be incomplete.{" "}
            {wateringEventsResult.error}
          </p>
        </section>
      ) : null}

      {!plantsResult.error && !wateringEventsResult.error && remindersResult.error ? (
        <section className="mb-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-5">
          <StatusPill tone="warning">Reminder state unavailable</StatusPill>
          <p className="mt-3 text-sm leading-6 text-amber-950/80">
            The collection is using watering history and intervals for now. {remindersResult.error}
          </p>
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
        <div className="grid gap-7">
          {roomGroups.map(([room, items]) => (
            <section key={room}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <RoomIcon className="h-5 w-5 shrink-0 text-[color:var(--accent)]" />
                  <h2 className="truncate text-lg font-semibold">{room}</h2>
                  <span className="rounded-full bg-[color:var(--stone)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--muted)]">
                    {items.length}
                  </span>
                </div>
                <Link
                  href="/app/plants/new"
                  className="inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add
                </Link>
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] px-4">
                {items.map((item) => (
                  <PlantCollectionRow
                    key={item.plant.id}
                    item={item}
                    photoUrl={photoUrls[item.plant.id]}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
