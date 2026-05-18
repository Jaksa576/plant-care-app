import Link from "next/link";
import { redirect } from "next/navigation";

import {
  applyCareSuggestionAction,
  archivePlantAction,
  disableWateringReminderAction,
  getFallbackCareSuggestionAction,
  identifyPlantPhotoAction,
  markWateredAction,
  removePlantPhotoAction,
  savePlantIdentificationSuggestionAction,
  saveWateringReminderAction,
  snoozeWateringReminderAction,
  uploadPlantPhotoAction,
} from "@/app/app/plants/actions";
import { AppShell } from "@/components/app-shell";
import { ArchivePlantForm } from "@/components/archive-plant-form";
import {
  CameraIcon,
  ChevronRightIcon,
  DropletIcon,
  LeafIcon,
  RoomIcon,
} from "@/components/icons";
import { GoogleCalendarPlantStatus } from "@/components/google-calendar-plant-status";
import { PlantIdentificationPanel } from "@/components/plant-identification-form";
import { PlantDetailActions } from "@/components/plant-detail-actions";
import { PlantPhotoForm } from "@/components/plant-photo-form";
import { PlantPhotoFrame } from "@/components/plant-photo";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { WateringReminderPanel } from "@/components/watering-reminder-form";
import { getAuthState } from "@/lib/auth";
import { getGoogleCalendarConfig } from "@/lib/env";
import {
  getGoogleCalendarConnection,
  getGoogleCalendarEventLinkForReminder,
} from "@/lib/google-calendar/data";
import { getPlantForUser } from "@/lib/plants/data";
import { createPlantPhotoUrlMap } from "@/lib/plants/photos";
import {
  createRoomNameMap,
  getPlantPrimaryLabel,
  getPlantRoomLabel,
  getPlantSecondaryLabel,
  getWateringIntervalLabel,
} from "@/lib/plants/presenters";
import type {
  GoogleCalendarConnectionRecord,
  GoogleCalendarEventLinkRecord,
  PlantRecord,
  WateringEventRecord,
  WateringReminderRecord,
} from "@/lib/plants/types";
import { getWateringReminderForPlant } from "@/lib/reminders/data";
import { getReminderSummary } from "@/lib/reminders/schedule";
import { listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listWateringEventsForPlant } from "@/lib/watering/data";
import {
  formatWateringHistoryDate,
  getReminderAwareWateringScheduleState,
  type WateringScheduleState,
} from "@/lib/watering/schedule";

type PlantProfilePageProps = {
  params: Promise<{
    plantId: string;
  }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
    photo?: string;
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
    <div className="flex items-start gap-3 border-b border-[color:var(--border-soft)] py-3 last:border-b-0">
      <span className="mt-0.5 text-[color:var(--accent)]">
        <LeafIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">{label}</p>
        <div className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{value}</div>
        {helper ? <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{helper}</p> : null}
      </div>
    </div>
  );
}

function MissingField({ children }: { children: React.ReactNode }) {
  return <span className="text-[color:var(--muted)]">{children}</span>;
}

function WateringHistorySection({
  events,
  showError,
}: {
  events: WateringEventRecord[];
  showError: boolean;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Care history</h3>
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
        <ol className="mt-4 divide-y divide-[color:var(--border-soft)]">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-3 py-3"
            >
              <DropletIcon className="h-4 w-4 text-[color:var(--accent)]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Watered</p>
                <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                  {formatWateringHistoryDate(event.watered_at)}
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 text-[color:var(--muted)]" />
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
  reminder,
  reminderError,
  googleCalendarConfigured,
  googleCalendarConnection,
  googleCalendarEventLink,
  roomLabel,
}: {
  plant: PlantRecord;
  schedule: WateringScheduleState;
  wateringStateError: boolean;
  wateringEvents: WateringEventRecord[];
  photoUrl?: string;
  reminder: WateringReminderRecord | null;
  reminderError: boolean;
  googleCalendarConfigured: boolean;
  googleCalendarConnection: GoogleCalendarConnectionRecord | null;
  googleCalendarEventLink: GoogleCalendarEventLinkRecord | null;
  roomLabel: string;
}) {
  const primaryLabel = getPlantPrimaryLabel(plant);
  const secondaryLabel = getPlantSecondaryLabel(plant);
  const intervalLabel = getWateringIntervalLabel(plant);
  const reminderSummary = getReminderSummary(reminder, plant, wateringEvents[0] ?? null);
  const hasActiveReminderDate = Boolean(reminder?.enabled && reminder.next_reminder_date);

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,26rem)]">
          <div className="min-h-72 bg-[color:var(--accent-soft)] lg:min-h-[32rem]">
            <PlantPhotoFrame
              photoUrl={photoUrl}
              alt={photoUrl ? `${primaryLabel} primary plant photo` : ""}
              variant="detail"
            />
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="max-w-2xl">
                <StatusPill tone={schedule.status === "overdue" ? "warning" : "success"}>
                  {schedule.nextWateringLabel}
                </StatusPill>
                <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground)] sm:text-4xl">
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
                <p className="mt-4 inline-flex items-center gap-2 text-sm leading-7 text-[color:var(--muted)]">
                  <RoomIcon className="h-4 w-4 text-[color:var(--accent)]" />
                  {roomLabel}
                </p>
              </div>

              <PlantDetailActions
                waterAction={markWateredAction.bind(null, plant.id)}
                snoozeAction={snoozeWateringReminderAction.bind(null, plant.id)}
                canSnooze={hasActiveReminderDate}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Care basics</h3>
          <Link
            href={`/app/plants/${plant.id}/edit`}
            className="text-sm font-semibold text-[color:var(--accent-ink)]"
          >
            Edit
          </Link>
        </div>
        <ProfileField
          label="Last watered"
          value={schedule.lastWateredLabel}
          helper={schedule.helperText}
        />
        <ProfileField
          label="Next watering"
          value={schedule.nextWateringLabel}
          helper={
            schedule.nextWateringDate
              ? hasActiveReminderDate
                ? "Using the active Plant Care reminder date."
                : "Calculated from the latest watering record and interval."
              : undefined
          }
        />
        <ProfileField
          label="Water every"
          value={intervalLabel ?? <MissingField>No watering interval set yet</MissingField>}
          helper="This is user-entered guidance only."
        />
        <ProfileField
          label="Room"
          value={roomLabel}
        />
        <ProfileField
          label="Notes"
          value={plant.notes ?? <MissingField>No notes added yet</MissingField>}
        />
        {plant.watering_guidance ? (
          <ProfileField label="Watering guidance" value={plant.watering_guidance} />
        ) : null}
        {plant.scientific_name ? (
          <ProfileField
            label="Scientific name"
            value={<span className="italic">{plant.scientific_name}</span>}
          />
        ) : null}
        {wateringStateError ? (
          <div className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            Could not load watering state. Refresh before relying on this status.
          </div>
        ) : null}
      </section>

      <WateringHistorySection events={wateringEvents} showError={wateringStateError} />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <CameraIcon className="h-5 w-5 text-[color:var(--accent)]" />
            <h3 className="text-xl font-semibold">Photo</h3>
          </div>
          <PlantPhotoForm
            uploadAction={uploadPlantPhotoAction.bind(null, plant.id)}
            removeAction={removePlantPhotoAction.bind(null, plant.id)}
            hasPhoto={Boolean(plant.primary_photo_path)}
          />
        </div>

        <PlantIdentificationPanel
          hasPhoto={Boolean(plant.primary_photo_path)}
          editHref={`/app/plants/${plant.id}/edit`}
          hasExistingWateringBasics={Boolean(
            plant.watering_interval_days || plant.watering_guidance,
          )}
          identifyAction={identifyPlantPhotoAction.bind(null, plant.id)}
          saveSuggestionAction={savePlantIdentificationSuggestionAction.bind(null, plant.id)}
          fallbackCareSuggestionAction={getFallbackCareSuggestionAction.bind(null, plant.id)}
          applyCareSuggestionAction={applyCareSuggestionAction.bind(null, plant.id)}
        />
      </section>

      <div id="watering-reminder">
        <WateringReminderPanel
          enabled={Boolean(reminder?.enabled)}
          summaryLabel={reminderSummary.label}
          helperText={
            reminderError
              ? "We couldn't load this reminder right now. Your watering history is still available."
              : reminderSummary.helperText
          }
          previewText={reminderSummary.previewText}
          dateInputValue={reminderSummary.dateInputValue}
          mode={reminderSummary.mode}
          canUseReminderTiming={Boolean(plant.watering_interval_days)}
          saveAction={saveWateringReminderAction.bind(null, plant.id)}
          disableAction={disableWateringReminderAction.bind(null, plant.id)}
          snoozeAction={snoozeWateringReminderAction.bind(null, plant.id)}
        />
      </div>

      <GoogleCalendarPlantStatus
        configured={googleCalendarConfigured}
        connection={googleCalendarConnection}
        eventLink={googleCalendarEventLink}
        reminderEnabled={Boolean(reminder?.enabled && reminder.next_reminder_date)}
      />
    </div>
  );
}

export default async function PlantProfilePage({ params, searchParams }: PlantProfilePageProps) {
  const [{ plantId }, { created, updated, photo, archiveError }, authState] = await Promise.all([
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
  const roomsResult = await listPlantRoomsForUser(supabase, authState.user.id);
  const roomNames = createRoomNameMap(roomsResult.data ?? []);
  const roomLabel = plant ? getPlantRoomLabel(plant, roomNames) : "Unassigned";
  const plantTitle = plant ? getPlantPrimaryLabel(plant) : "Plant not available";
  const wateringResult = plant
    ? await listWateringEventsForPlant(supabase, authState.user.id, plant.id)
    : null;
  const reminderResult = plant
    ? await getWateringReminderForPlant(supabase, authState.user.id, plant.id)
    : null;
  const googleCalendarConnectionResult = plant
    ? await getGoogleCalendarConnection(supabase, authState.user.id)
    : null;
  const googleCalendarEventLinkResult = reminderResult?.data
    ? await getGoogleCalendarEventLinkForReminder(
        supabase,
        authState.user.id,
        reminderResult.data.id,
      )
    : null;
  const wateringEvents = wateringResult?.data ?? [];
  const schedule = plant
    ? getReminderAwareWateringScheduleState(
        plant,
        wateringEvents[0] ?? null,
        reminderResult?.data ?? null,
      )
    : null;
  const photoUrls = plant ? await createPlantPhotoUrlMap(supabase, [plant]) : {};

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title={plantTitle}
      subtitle="Everything about this plant, with watering first and supporting tools close by."
      actions={<SignOutButton />}
    >
      <div className="flex flex-col gap-6">
        <Link
          href="/app/plants"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          Back to Plants
        </Link>

        {created === "1" ? (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <StatusPill tone="success">Plant saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">
              {photo === "saved"
                ? "Your plant profile and photo are ready. You can refine the details any time."
                : "Your plant profile is ready. You can refine the details any time."}
            </p>
          </div>
        ) : null}

        {photo === "failed" ? (
          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4">
            <StatusPill tone="warning">Photo not saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-amber-950/80">
              The plant was saved, but the optional photo did not upload. You can add it from
              the Photo section below.
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
              reminder={reminderResult?.data ?? null}
              reminderError={Boolean(reminderResult?.error)}
              googleCalendarConfigured={Boolean(getGoogleCalendarConfig())}
              googleCalendarConnection={googleCalendarConnectionResult?.data ?? null}
              googleCalendarEventLink={googleCalendarEventLinkResult?.data ?? null}
              roomLabel={roomLabel}
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
