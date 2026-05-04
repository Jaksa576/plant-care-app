import Link from "next/link";
import { redirect } from "next/navigation";

import {
  archivePlantAction,
  markWateredAction,
  removePlantPhotoAction,
  uploadPlantPhotoAction,
} from "@/app/app/plants/actions";
import { AppShell } from "@/components/app-shell";
import { ArchivePlantForm } from "@/components/archive-plant-form";
import { MarkWateredForm } from "@/components/mark-watered-form";
import { PlantPhotoForm } from "@/components/plant-photo-form";
import { PlantPhotoFrame } from "@/components/plant-photo";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { getPlantForUser } from "@/lib/plants/data";
import { createPlantPhotoUrlMap } from "@/lib/plants/photos";
import {
  getPlantPrimaryLabel,
  getPlantSecondaryLabel,
  getWateringIntervalLabel,
} from "@/lib/plants/presenters";
import type { PlantRecord, WateringEventRecord } from "@/lib/plants/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listWateringEventsForPlant } from "@/lib/watering/data";
import {
  formatWateringHistoryDate,
  getWateringScheduleState,
  type WateringScheduleState,
} from "@/lib/watering/schedule";

type PlantProfilePageProps = {
  params: Promise<{
    plantId: string;
  }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
    archiveError?: string;
  }>;
};

type ProfileFieldProps = {
  label: string;
  value: React.ReactNode;
  helper?: string;
};

function ProfileField({ label, value, helper }: ProfileFieldProps) {
  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
        {label}
      </p>
      <div className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">{value}</div>
      {helper ? <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{helper}</p> : null}
    </div>
  );
}

function MissingField({ children }: { children: React.ReactNode }) {
  return <span className="text-[color:var(--muted)]">{children}</span>;
}

function WateringStatusCard({
  plant,
  schedule,
  showError,
}: {
  plant: PlantRecord;
  schedule: WateringScheduleState;
  showError: boolean;
}) {
  const statusTone = schedule.status === "overdue" ? "warning" : "success";

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusPill tone={statusTone}>Watering</StatusPill>
          <h3 className="mt-5 text-2xl font-semibold">{schedule.nextWateringLabel}</h3>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            {schedule.helperText}
          </p>
        </div>
        <Link
          href={`/app/plants/${plant.id}/edit`}
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          Edit interval
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ProfileField label="Last watered" value={schedule.lastWateredLabel} />
        <ProfileField
          label="Next watering"
          value={schedule.nextWateringLabel}
          helper={schedule.nextWateringDate ? "Calculated from the latest watering record." : undefined}
        />
      </div>

      {showError ? (
        <div className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          Could not load watering state. The action is hidden until this plant can be checked again.
        </div>
      ) : (
        <div className="mt-6">
          <MarkWateredForm action={markWateredAction.bind(null, plant.id)} />
        </div>
      )}
    </section>
  );
}

function WateringHistorySection({
  events,
  showError,
}: {
  events: WateringEventRecord[];
  showError: boolean;
}) {
  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Recent watering
        </p>
        <h3 className="text-2xl font-semibold">Watering history</h3>
      </div>

      {showError ? (
        <p className="mt-5 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          We couldn&apos;t load watering history right now. Please try again after refreshing.
        </p>
      ) : null}

      {!showError && events.length === 0 ? (
        <p className="mt-5 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
          No watering recorded yet. Mark this plant as watered to start its history.
        </p>
      ) : null}

      {!showError && events.length > 0 ? (
        <ol className="mt-5 flex flex-col gap-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 px-4 py-3"
            >
              <p className="text-base font-semibold">{formatWateringHistoryDate(event.watered_at)}</p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">Watered</p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function PlantProfile({
  plant,
  schedule,
  wateringStateError,
  wateringEvents,
  photoUrl,
}: {
  plant: PlantRecord;
  schedule: WateringScheduleState;
  wateringStateError: boolean;
  wateringEvents: WateringEventRecord[];
  photoUrl?: string;
}) {
  const primaryLabel = getPlantPrimaryLabel(plant);
  const secondaryLabel = getPlantSecondaryLabel(plant);
  const intervalLabel = getWateringIntervalLabel(plant);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-start">
          <div className="flex flex-col gap-5">
            <PlantPhotoFrame
              photoUrl={photoUrl}
              alt={photoUrl ? `${primaryLabel} primary plant photo` : ""}
            />
            <PlantPhotoForm
              uploadAction={uploadPlantPhotoAction.bind(null, plant.id)}
              removeAction={removePlantPhotoAction.bind(null, plant.id)}
              hasPhoto={Boolean(plant.primary_photo_path)}
            />
          </div>

          <div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between lg:flex-col">
              <div className="max-w-2xl">
                <StatusPill>Plant profile</StatusPill>
                <h2 className="mt-5 text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
                  {primaryLabel}
                </h2>
                {secondaryLabel ? (
                  <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
                    {secondaryLabel}
                  </p>
                ) : null}
                {plant.scientific_name ? (
                  <p className="mt-2 text-sm italic leading-6 text-[color:var(--muted)]">
                    {plant.scientific_name}
                  </p>
                ) : null}
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
                  {plant.location ?? "No room or location set yet."}
                </p>
              </div>

              <Link
                href={`/app/plants/${plant.id}/edit`}
                className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Edit details
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WateringStatusCard
        plant={plant}
        schedule={schedule}
        showError={wateringStateError}
      />

      <WateringHistorySection events={wateringEvents} showError={wateringStateError} />

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Care basics
          </p>
          <h3 className="text-2xl font-semibold">Editable guidance</h3>
          <p className="text-sm leading-7 text-[color:var(--muted)]">
            These are your notes for this plant. They do not calculate watering due dates yet.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ProfileField
            label="Nickname"
            value={plant.nickname ?? <MissingField>No nickname set</MissingField>}
          />
          <ProfileField
            label="Common name"
            value={plant.common_name ?? <MissingField>No common name set</MissingField>}
          />
          <ProfileField
            label="Room or location"
            value={plant.location ?? <MissingField>No location set yet</MissingField>}
          />
          <ProfileField
            label="Scientific name"
            value={
              plant.scientific_name ? (
                <span className="italic">{plant.scientific_name}</span>
              ) : (
                <MissingField>No scientific name set</MissingField>
              )
            }
          />
          <ProfileField
            label="Watering interval"
            value={intervalLabel ?? <MissingField>No watering interval set yet</MissingField>}
            helper="This is user-entered guidance only."
          />
          <ProfileField
            label="Watering guidance"
            value={
              plant.watering_guidance ?? <MissingField>No watering notes added yet</MissingField>
            }
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
          Notes
        </p>
        {plant.notes ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[color:var(--foreground)] sm:text-base">
            {plant.notes}
          </p>
        ) : (
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            No extra notes yet. Add anything useful from the edit screen when you need it.
          </p>
        )}
      </section>
    </div>
  );
}

export default async function PlantProfilePage({ params, searchParams }: PlantProfilePageProps) {
  const [{ plantId }, { created, updated, archiveError }, authState] = await Promise.all([
    params,
    searchParams,
    getAuthState(),
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

  const result = await getPlantForUser(supabase, authState.user.id, plantId);
  const plant = result.data;
  const plantTitle = plant ? getPlantPrimaryLabel(plant) : "Plant not available";
  const wateringResult = plant
    ? await listWateringEventsForPlant(supabase, authState.user.id, plant.id)
    : null;
  const wateringEvents = wateringResult?.data ?? [];
  const schedule = plant
    ? getWateringScheduleState(plant, wateringEvents[0] ?? null)
    : null;
  const photoUrls = plant ? await createPlantPhotoUrlMap(supabase, [plant]) : {};

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title={plantTitle}
      subtitle="Review this plant record, its optional photo, and the watering state that belongs to this account."
      actions={<SignOutButton />}
    >
      <div className="flex flex-col gap-6">
        <Link
          href="/app"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          Back to your collection
        </Link>

        {created === "1" ? (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <StatusPill tone="success">Plant saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">
              Your plant profile is ready. You can refine the details any time.
            </p>
          </div>
        ) : null}

        {updated === "1" ? (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <StatusPill tone="success">Changes saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">
              This profile now shows your latest plant details.
            </p>
          </div>
        ) : null}

        {result.error ? (
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill tone="warning">Plant unavailable</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">We couldn&apos;t open that plant</h2>
            <p className="mt-3 text-sm leading-7 text-amber-950/80 sm:text-base">
              {result.error}
            </p>
          </section>
        ) : null}

        {!result.error && !plant ? (
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill>Not found here</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">
              This plant isn&apos;t available in your collection
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              It may have been archived already, or it may belong to a different signed-in account.
            </p>
          </section>
        ) : null}

        {plant && schedule ? (
          <>
            <PlantProfile
              plant={plant}
              schedule={schedule}
              wateringStateError={Boolean(wateringResult?.error)}
              wateringEvents={wateringEvents}
              photoUrl={photoUrls[plant.id]}
            />
            <ArchivePlantForm
              action={archivePlantAction.bind(
                null,
                plantId,
                `/app/plants/${plantId}?archiveError=1`,
              )}
              showError={archiveError === "1"}
            />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
