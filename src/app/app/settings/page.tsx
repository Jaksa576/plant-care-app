import {
  archiveRoomAction,
  createRoomAction,
  renameRoomAction,
} from "@/app/app/settings/actions";
import { disconnectGoogleCalendarAction } from "@/app/app/integrations/google-calendar/actions";
import { AppShell } from "@/components/app-shell";
import { GoogleCalendarSettingsPanel } from "@/components/google-calendar-settings-panel";
import { BellIcon, GearIcon, RoomIcon, SproutIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { getGoogleCalendarConfig } from "@/lib/env";
import {
  getGoogleCalendarConnection,
  listGoogleCalendarEventLinksForUser,
} from "@/lib/google-calendar/data";
import { listPlantsForUser } from "@/lib/plants/data";
import type { GoogleCalendarEventLinkRecord } from "@/lib/plants/types";
import { listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type SettingsPageProps = {
  searchParams: Promise<{
    rooms?: string;
    googleCalendar?: string;
  }>;
};

function getRoomStatusMessage(status?: string) {
  switch (status) {
    case "created":
      return { tone: "success" as const, message: "Room added." };
    case "renamed":
      return { tone: "success" as const, message: "Room renamed. Plant assignments stayed in place." };
    case "archived":
      return { tone: "success" as const, message: "Room archived. Assigned plants moved to Unassigned." };
    case "duplicate":
      return { tone: "warning" as const, message: "Use a room name that is not already active." };
    case "name-required":
      return { tone: "warning" as const, message: "Add a room name before saving." };
    case "archive-error":
      return { tone: "warning" as const, message: "We couldn't archive that room. Please refresh and try again." };
    default:
      return null;
  }
}

function getLatestGoogleCalendarEventSync(links: GoogleCalendarEventLinkRecord[]) {
  let latest: GoogleCalendarEventLinkRecord | null = null;

  for (const link of links) {
    if (!latest) {
      latest = link;
      continue;
    }

    const linkTime = link.last_synced_at ? Date.parse(link.last_synced_at) : 0;
    const latestTime = latest.last_synced_at ? Date.parse(latest.last_synced_at) : 0;

    if (linkTime > latestTime) {
      latest = link;
    }
  }

  return latest
    ? {
        status: latest.last_sync_status,
        error: latest.last_sync_error,
        syncedAt: latest.last_synced_at,
      }
    : null;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
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

  const [roomsResult, plantsResult, calendarConnectionResult, calendarEventLinksResult] =
    await Promise.all([
      listPlantRoomsForUser(supabase, authState.user.id),
      listPlantsForUser(supabase, authState.user.id),
      getGoogleCalendarConnection(supabase, authState.user.id),
      listGoogleCalendarEventLinksForUser(supabase, authState.user.id),
    ]);
  const rooms = roomsResult.data ?? [];
  const plants = plantsResult.data ?? [];
  const calendarEventLinks = calendarEventLinksResult.data ?? [];
  const roomPlantCounts = plants.reduce<Record<string, number>>((counts, plant) => {
    if (plant.room_id) {
      counts[plant.room_id] = (counts[plant.room_id] ?? 0) + 1;
    }

    return counts;
  }, {});
  const roomStatus = getRoomStatusMessage(params.rooms);
  const googleCalendarConfigured = Boolean(getGoogleCalendarConfig());
  const latestEventSync = getLatestGoogleCalendarEventSync(calendarEventLinks);

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Settings"
      subtitle="Account and app-level controls stay secondary to the daily watering flow."
      actions={<SignOutButton />}
    >
      <div className="grid gap-4">
        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <GearIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Signed in as {authState.user.email ?? "this account"}.
              </p>
              <div className="mt-4">
                <SignOutButton />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <RoomIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold">Rooms</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Manage room names for your plant collection. Archiving a room keeps every
                plant and moves assigned plants to Unassigned.
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                We organized your existing plant locations into rooms. Review them anytime.
              </p>

              {roomStatus ? (
                <div className="mt-4 rounded-2xl border border-[color:var(--border-soft)] bg-white/70 p-4">
                  <StatusPill tone={roomStatus.tone}>{roomStatus.tone}</StatusPill>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {roomStatus.message}
                  </p>
                </div>
              ) : null}

              <form action={createRoomAction} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <label className="min-w-0 flex-1">
                  <span className="text-sm font-semibold">Add room</span>
                  <input
                    name="name"
                    placeholder="Kitchen"
                    className="mt-2 min-h-[var(--tap-target)] w-full rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-[color:var(--accent)]"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Add room
                </button>
              </form>

              <div className="mt-5 divide-y divide-[color:var(--border-soft)] rounded-[1.25rem] border border-[color:var(--border-soft)] bg-white/60">
                {roomsResult.error ? (
                  <p className="p-4 text-sm leading-6 text-amber-900">{roomsResult.error}</p>
                ) : null}
                {!roomsResult.error && rooms.length === 0 ? (
                  <p className="p-4 text-sm leading-6 text-[color:var(--muted)]">
                    No rooms yet. Plants can stay Unassigned until rooms are useful.
                  </p>
                ) : null}
                {rooms.map((room) => {
                  const plantCount = roomPlantCounts[room.id] ?? 0;

                  return (
                    <div key={room.id} className="grid gap-3 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">{room.name}</h3>
                          <p className="text-sm text-[color:var(--muted)]">
                            {plantCount} plant{plantCount === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                        <form action={renameRoomAction} className="flex min-w-0 gap-2">
                          <input type="hidden" name="roomId" value={room.id} />
                          <input
                            name="name"
                            defaultValue={room.name}
                            aria-label={`Rename ${room.name}`}
                            className="min-h-[var(--tap-target)] min-w-0 flex-1 rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm outline-none transition focus:border-[color:var(--accent)]"
                          />
                          <button
                            type="submit"
                            className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
                          >
                            Rename
                          </button>
                        </form>

                        <form action={archiveRoomAction}>
                          <input type="hidden" name="roomId" value={room.id} />
                          <button
                            type="submit"
                            className="inline-flex min-h-[var(--tap-target)] w-full items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-100 sm:w-auto"
                          >
                            Archive
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <SproutIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Setup</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Review the short onboarding path any time. It stays optional and never blocks
                the watering dashboard.
              </p>
              <Link
                href="/app/onboarding?review=1"
                className="mt-4 inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
              >
                Review setup
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <BellIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Reminders</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Watering reminders remain app-owned and are managed from each plant.
              </p>
            </div>
          </div>
        </section>

        <GoogleCalendarSettingsPanel
          configured={googleCalendarConfigured}
          connection={calendarConnectionResult.data ?? null}
          linkedEventCount={calendarEventLinks.length}
          latestEventSync={latestEventSync}
          queryStatus={params.googleCalendar}
          disconnectAction={disconnectGoogleCalendarAction}
        />
      </div>
    </AppShell>
  );
}
