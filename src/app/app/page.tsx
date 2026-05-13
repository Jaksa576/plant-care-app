import { AppShell } from "@/components/app-shell";
import {
  markWateredAction,
  snoozeWateringReminderAction,
} from "@/app/app/plants/actions";
import { TodaySnoozeButton, TodayWaterButton } from "@/components/home-today-actions";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  PlusIcon,
  RoomIcon,
} from "@/components/icons";
import { PlantPhotoFrame } from "@/components/plant-photo";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { createPlantPhotoUrlMap } from "@/lib/plants/photos";
import {
  createRoomNameMap,
  getPlantPrimaryLabel,
  getPlantRoomLabel,
  getPlantSecondaryLabel,
} from "@/lib/plants/presenters";
import type { PlantRecord, WateringEventRecord } from "@/lib/plants/types";
import { listWateringRemindersForUser } from "@/lib/reminders/data";
import { listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserAppPreferencesForUser } from "@/lib/user-preferences/data";
import {
  getDashboardAttentionCount,
  getDashboardPlants,
  getWateringDashboardGroups,
  type DashboardPlant,
} from "@/lib/watering/dashboard";
import { formatWateringHistoryDate } from "@/lib/watering/schedule";
import { listWateringEventsForUser } from "@/lib/watering/data";
import Link from "next/link";
import { redirect } from "next/navigation";

type AppPageProps = {
  searchParams: Promise<{
    archived?: string;
  }>;
};

function formatTodayDate() {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function getGuidanceLabel(item: DashboardPlant) {
  if (item.reminder) {
    return item.reminder.reminder_mode === "fixed_schedule"
      ? "Fixed reminder"
      : "After-watering reminder";
  }

  if (item.plant.watering_interval_days) {
    return `Every ${item.plant.watering_interval_days} day${
      item.plant.watering_interval_days === 1 ? "" : "s"
    }`;
  }

  return "No interval yet";
}

function getStatusTone(status: DashboardPlant["schedule"]["status"]) {
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

function groupDashboardPlantsByRoom(items: DashboardPlant[], roomNames: Map<string, string>) {
  const groups = new Map<string, DashboardPlant[]>();

  for (const item of items) {
    const room = getPlantRoomLabel(item.plant, roomNames);
    const roomPlants = groups.get(room) ?? [];
    roomPlants.push(item);
    groups.set(room, roomPlants);
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

function getRecentCareEvents(events: WateringEventRecord[], plants: PlantRecord[]) {
  const plantsById = new Map(plants.map((plant) => [plant.id, plant]));

  return events
    .map((event) => ({
      event,
      plant: plantsById.get(event.plant_id) ?? null,
    }))
    .filter((item): item is { event: WateringEventRecord; plant: PlantRecord } =>
      Boolean(item.plant),
    )
    .slice(0, 5);
}

function TodayPlantRow({
  item,
  photoUrl,
  roomLabel,
}: {
  item: DashboardPlant;
  photoUrl?: string;
  roomLabel: string;
}) {
  const primaryLabel = getPlantPrimaryLabel(item.plant);
  const secondaryLabel = getPlantSecondaryLabel(item.plant);
  const statusClass = getStatusTone(item.schedule.status);

  return (
    <article className="grid grid-cols-[auto_1fr_auto] gap-3 border-b border-[color:var(--border-soft)] py-4 last:border-b-0">
      <Link href={`/app/plants/${item.plant.id}`} aria-label={`Open ${primaryLabel}`}>
        <PlantPhotoFrame
          photoUrl={photoUrl}
          alt={photoUrl ? `${primaryLabel} primary plant photo` : ""}
          variant="thumbnail"
        />
      </Link>

      <div className="min-w-0">
        <Link href={`/app/plants/${item.plant.id}`} className="group block">
          <h3 className="truncate text-base font-semibold leading-5 transition group-hover:text-[color:var(--accent)]">
            {primaryLabel}
          </h3>
        </Link>
        <p className="mt-1 truncate text-sm leading-5 text-[color:var(--muted)]">
          {roomLabel}
          {secondaryLabel ? ` - ${secondaryLabel}` : ""}
        </p>
        <p className="mt-0.5 text-sm leading-5 text-[color:var(--muted)]">
          {item.schedule.lastWateredLabel}
        </p>
        <p className={`mt-0.5 text-sm font-semibold leading-5 ${statusClass}`}>
          {item.schedule.nextWateringLabel}
        </p>
        <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
          {getGuidanceLabel(item)}
        </p>
      </div>

      <div className="flex shrink-0 items-start gap-2">
        <TodayWaterButton action={markWateredAction.bind(null, item.plant.id)} />
        {item.reminder ? (
          <TodaySnoozeButton
            action={snoozeWateringReminderAction.bind(null, item.plant.id)}
          />
        ) : (
          <TodaySnoozeButton
            action={snoozeWateringReminderAction.bind(null, item.plant.id)}
            disabled
          />
        )}
      </div>
    </article>
  );
}

export default async function AppPage({ searchParams }: AppPageProps) {
  const [authState, { archived }] = await Promise.all([
    getAuthState(),
    searchParams,
  ]);

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

  const [
    preferencesResult,
    plantsResult,
    wateringEventsResult,
    remindersResult,
    roomsResult,
  ] = await Promise.all([
    getUserAppPreferencesForUser(supabase, authState.user.id),
    listPlantsForUser(supabase, authState.user.id),
    listWateringEventsForUser(supabase, authState.user.id),
    listWateringRemindersForUser(supabase, authState.user.id),
    listPlantRoomsForUser(supabase, authState.user.id),
  ]);
  const plants = plantsResult.data ?? [];

  if (
    !preferencesResult.error &&
    !preferencesResult.data?.onboarding_completed_at &&
    !plantsResult.error &&
    plants.length === 0
  ) {
    redirect("/app/onboarding");
  }

  const photoUrls = await createPlantPhotoUrlMap(supabase, plants);
  const dashboardPlants = getDashboardPlants(
    plants,
    wateringEventsResult.data ?? [],
    remindersResult.data ?? [],
  );
  const dashboardGroups = getWateringDashboardGroups(dashboardPlants);
  const attentionCount = getDashboardAttentionCount(dashboardGroups);
  const needsWaterPlants = [...dashboardGroups.overdue, ...dashboardGroups.dueToday];
  const roomNames = createRoomNameMap(roomsResult.data ?? []);
  const roomGroups = groupDashboardPlantsByRoom(dashboardPlants, roomNames);
  const recentCare = getRecentCareEvents(wateringEventsResult.data ?? [], plants);

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Today"
      subtitle={`${formatTodayDate()} - water what needs care, then move on with your day.`}
      actions={<SignOutButton />}
      showAddPlantAction={false}
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

        <section className="border-b border-[color:var(--border-soft)] pb-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[color:var(--muted)]">
                {formatTodayDate()}
              </p>
              <h2 className="mt-1 text-3xl font-semibold leading-tight">Today</h2>
            </div>
            <Link
              href="/app/plants/new"
              aria-label="Add plant"
              className="inline-flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent)] text-white shadow-[0_10px_22px_rgba(46,125,83,0.22)] transition hover:opacity-95"
            >
              <PlusIcon className="h-5 w-5" />
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

        {!plantsResult.error && wateringEventsResult.error ? (
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill tone="warning">Watering state unavailable</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">We couldn&apos;t load watering state</h2>
            <p className="mt-3 text-sm leading-7 text-amber-950/80 sm:text-base">
              {wateringEventsResult.error}
            </p>
          </section>
        ) : null}

        {!plantsResult.error && !wateringEventsResult.error && remindersResult.error ? (
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill tone="warning">Reminder state unavailable</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">We couldn&apos;t load reminders</h2>
            <p className="mt-3 text-sm leading-7 text-amber-950/80 sm:text-base">
              The dashboard is using watering history and intervals for now. {remindersResult.error}
            </p>
          </section>
        ) : null}

        {!plantsResult.error && plants.length === 0 ? (
          <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-6">
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--surface-strong)] ring-1 ring-[color:var(--border-soft)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/plant-care-approved-icon-square-1024.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <h2 className="mt-5 text-2xl font-semibold">No plants yet</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Add your first plant to start a calm watering-first collection. Photos and
              identification can come later.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/app/plants/new"
                className="inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                <PlusIcon className="h-4 w-4" />
                Add manually
              </Link>
              <Link
                href="/app/plants/new?start=photo"
                className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
              >
                Start with a photo
              </Link>
            </div>
          </section>
        ) : null}

        {!plantsResult.error && plants.length > 0 ? (
          <div className="grid gap-7">
            <section>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-lg font-semibold">Needs water</h2>
                <span className="rounded-full bg-[color:var(--clay)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--attention)]">
                  {attentionCount}
                </span>
              </div>
              <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] px-4">
                {needsWaterPlants.length > 0 ? (
                  needsWaterPlants.map((item) => (
                    <TodayPlantRow
                      key={item.plant.id}
                      item={item}
                      photoUrl={photoUrls[item.plant.id]}
                      roomLabel={getPlantRoomLabel(item.plant, roomNames)}
                    />
                  ))
                ) : (
                  <div className="flex items-start gap-3 py-5">
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 text-[color:var(--accent)]" />
                    <div>
                      <h3 className="font-semibold">All caught up</h3>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                        No plants need water right now.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">By room</h2>
                <Link href="/app/plants" className="text-sm font-semibold text-[color:var(--accent-ink)]">
                  View all
                </Link>
              </div>
              <div className="grid gap-4">
                {roomGroups.map(([room, roomPlants]) => (
                  <div
                    key={room}
                    className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] px-4"
                  >
                    <div className="flex min-h-[var(--tap-target)] items-center gap-3 border-b border-[color:var(--border-soft)] py-3">
                      <RoomIcon className="h-5 w-5 text-[color:var(--accent)]" />
                      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{room}</h3>
                      <span className="rounded-full bg-[color:var(--stone)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--muted)]">
                        {roomPlants.length}
                      </span>
                    </div>
                    {roomPlants.map((item) => (
                      <TodayPlantRow
                        key={item.plant.id}
                        item={item}
                        photoUrl={photoUrls[item.plant.id]}
                        roomLabel={room}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Recent care</h2>
                <ClockIcon className="h-5 w-5 text-[color:var(--accent)]" />
              </div>
              <div className="divide-y divide-[color:var(--border-soft)] rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)]">
                {recentCare.length > 0 ? (
                  recentCare.map(({ event, plant }) => {
                    const primaryLabel = getPlantPrimaryLabel(plant);

                    return (
                      <Link
                        key={event.id}
                        href={`/app/plants/${plant.id}`}
                        className="flex min-h-[var(--tap-target)] items-center gap-3 px-4 py-3 transition hover:bg-[color:var(--stone)]"
                      >
                        <CalendarIcon className="h-5 w-5 text-[color:var(--accent)]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{primaryLabel} watered</p>
                          <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                            {formatWateringHistoryDate(event.watered_at)}
                          </p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-[color:var(--muted)]" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="flex items-start gap-3 px-4 py-5">
                    <ClockIcon className="mt-0.5 h-5 w-5 text-[color:var(--accent)]" />
                    <div>
                      <h3 className="font-semibold">No care logged yet</h3>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                        Watering you record will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
