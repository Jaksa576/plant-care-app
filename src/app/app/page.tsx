import { AppShell } from "@/components/app-shell";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { DashboardSection } from "@/components/watering-dashboard";
import { getAuthState } from "@/lib/auth";
import { listPlantsForUser } from "@/lib/plants/data";
import { createPlantPhotoUrlMap } from "@/lib/plants/photos";
import { listWateringRemindersForUser } from "@/lib/reminders/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getDashboardAttentionCount,
  getDashboardPlants,
  getWateringDashboardGroups,
} from "@/lib/watering/dashboard";
import { listWateringEventsForUser } from "@/lib/watering/data";
import Link from "next/link";
import { redirect } from "next/navigation";

type AppPageProps = {
  searchParams: Promise<{
    archived?: string;
    googleCalendar?: string;
  }>;
};

export default async function AppPage({ searchParams }: AppPageProps) {
  const [authState, { archived, googleCalendar }] = await Promise.all([
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
  const dashboardGroups = getWateringDashboardGroups(dashboardPlants);
  const attentionCount = getDashboardAttentionCount(dashboardGroups);
  const allPlantsNeedIntervals =
    plants.length > 0 && dashboardGroups.needsInterval.length === plants.length;

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Today"
      subtitle="A calm scan of watering needs for the plants that belong to this account."
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
                Watering dashboard
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                {attentionCount === 0
                  ? "No plants need water today."
                  : `${attentionCount} plant${attentionCount === 1 ? "" : "s"} may need water.`}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                Watering state uses enabled Plant Care reminders first, then falls back to each
                plant&apos;s latest watering record and editable interval. No notifications are sent.
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

        {googleCalendar ? (
          <div
            className={`rounded-[1.75rem] border px-5 py-4 ${
              googleCalendar === "connected"
                ? "border-emerald-200 bg-emerald-50"
                : "border-amber-200 bg-amber-50"
            }`}
          >
            <StatusPill tone={googleCalendar === "connected" ? "success" : "warning"}>
              Google Calendar
            </StatusPill>
            <p
              className={`mt-3 text-sm leading-7 ${
                googleCalendar === "connected" ? "text-emerald-950/80" : "text-amber-950/80"
              }`}
            >
              {googleCalendar === "connected"
                ? "Google Calendar connected. Open a plant reminder to update its calendar event."
                : "Google Calendar could not be connected. Plant Care reminders are unchanged."}
            </p>
          </div>
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
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill>Empty collection</StatusPill>
            <h2 className="mt-5 text-3xl font-semibold">No plants yet, and that&apos;s okay.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Add your first plant to start tracking watering. Photos can come later, no AI
              identification has happened here, and watering guidance stays editable.
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
          <div className="grid gap-5">
            {allPlantsNeedIntervals ? (
              <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
                <StatusPill>No intervals yet</StatusPill>
                <h2 className="mt-5 text-2xl font-semibold">Add watering intervals to see what is due.</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  You can still open a plant and record watering now. Intervals or enabled reminders
                  let the dashboard sort plants into overdue, due today, and upcoming.
                </p>
              </section>
            ) : null}

              <DashboardSection
                title="Overdue"
                description="Plants with an enabled reminder or next watering date before today."
                emptyMessage="Nothing overdue right now."
                plants={dashboardGroups.overdue}
                photoUrls={photoUrls}
                showAction
              />
            <DashboardSection
              title="Due today"
                description="Plants with an enabled reminder due today, plus interval-based plants due today."
                emptyMessage="No plants due today."
                plants={dashboardGroups.dueToday}
                photoUrls={photoUrls}
                showAction
              />
            <DashboardSection
              title="Upcoming"
                description="Plants with an enabled reminder or next watering date in the next 7 days."
                emptyMessage="Add watering intervals or reminders to see upcoming care."
                plants={dashboardGroups.upcoming}
                photoUrls={photoUrls}
              />
            <DashboardSection
              title="Recently watered"
                description="Plants watered in the last 7 days."
                emptyMessage="Watering you record will appear here."
                plants={dashboardGroups.recentlyWatered}
                photoUrls={photoUrls}
              />
            {dashboardGroups.needsInterval.length > 0 ? (
              <DashboardSection
                title="Needs interval"
                description="Plants without a watering interval or enabled reminder date yet."
                emptyMessage="Every active plant has an interval or enabled reminder date."
                plants={dashboardGroups.needsInterval}
                photoUrls={photoUrls}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
