"use client";

import { useActionState, useState } from "react";

import { CameraIcon, DropletIcon, LeafIcon, RoomIcon } from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import {
  emptyPlantFormState,
  type PlantFormState,
  type PlantFormValues,
} from "@/lib/plants/types";
import type { PlantRoomRecord } from "@/lib/rooms/types";

type PlantFormProps = {
  action: (state: PlantFormState, formData: FormData) => Promise<PlantFormState>;
  submitLabel: string;
  title: string;
  description: string;
  initialValues?: PlantFormValues;
  rooms?: PlantRoomRecord[];
  allowInitialPhoto?: boolean;
  startsWithPhoto?: boolean;
};

type ReviewItemProps = {
  label: string;
  value: string;
  emptyLabel?: string;
};

function FormField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows,
  requiredHint,
}: {
  label: string;
  name: keyof PlantFormValues;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  requiredHint?: string;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const sharedClassName =
    "min-h-[var(--tap-target)] rounded-[1rem] border bg-[color:var(--surface-strong)] px-4 py-3 text-base outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]";
  const className = `${sharedClassName} ${
    error
      ? "border-amber-400 bg-amber-50/70"
      : "border-[color:var(--border)]"
  }`;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
      <span>
        {label}
        {requiredHint ? (
          <span className="ml-2 text-xs font-semibold text-[color:var(--attention)]">
            {requiredHint}
          </span>
        ) : null}
      </span>
      {requiredHint ? (
        <span id={hintId} className="text-xs leading-5 text-[color:var(--muted)]">
          Required as part of the plant name.
        </span>
      ) : null}
      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : requiredHint ? hintId : undefined}
          className={className}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : requiredHint ? hintId : undefined}
          className={className}
        />
      )}
      {error ? (
        <span id={errorId} className="text-sm font-semibold text-amber-900">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ReviewItem({ label, value, emptyLabel = "Not added yet" }: ReviewItemProps) {
  return (
    <div className="border-b border-[color:var(--border-soft)] py-3 last:border-b-0">
      <p className="text-sm font-semibold text-[color:var(--foreground)]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
        {value.trim().length > 0 ? value : emptyLabel}
      </p>
    </div>
  );
}

function RoomSelectField({
  rooms,
  value,
  onChange,
  error,
}: {
  rooms: PlantRoomRecord[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const errorId = "roomId-error";

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
      <span>Managed room</span>
      <select
        name="roomId"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-[var(--tap-target)] rounded-[1rem] border bg-[color:var(--surface-strong)] px-4 py-3 text-base outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)] ${
          error
            ? "border-amber-400 bg-amber-50/70"
            : "border-[color:var(--border)]"
        }`}
      >
        <option value="">Unassigned</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="text-sm font-semibold text-amber-900">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[color:var(--accent)]">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function PlantForm({
  action,
  submitLabel,
  title,
  description,
  initialValues,
  rooms = [],
  allowInitialPhoto = false,
  startsWithPhoto = false,
}: PlantFormProps) {
  const startingState = {
    ...emptyPlantFormState,
    values: initialValues ?? emptyPlantFormState.values,
  };
  const [state, formAction, isPending] = useActionState(action, startingState);
  const [step, setStep] = useState<"edit" | "review">("edit");
  const [values, setValues] = useState<PlantFormValues>(startingState.values);

  const fieldErrors = state.fieldErrors;

  function updateField(name: keyof PlantFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  const selectedRoomLabel =
    values.newRoomName.trim() ||
    rooms.find((room) => room.id === values.roomId)?.name ||
    "Unassigned";

  return (
    <div className="flex flex-col gap-6">
      <section className="border-b border-[color:var(--border-soft)] pb-5">
        <StatusPill>
          {step === "edit"
            ? startsWithPhoto
              ? "Photo first"
              : "Manual entry"
            : "Review before save"}
        </StatusPill>
        <h2 className="mt-4 text-3xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          {description}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--muted)]">
          <CameraIcon className="h-4 w-4 text-[color:var(--accent)]" />
          {allowInitialPhoto ? "Photo is optional" : "Photo can be added after save"}
        </div>
      </section>

      {state.message ? (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4">
          <StatusPill tone="warning">Something needs attention</StatusPill>
          <p className="mt-3 text-sm leading-7 text-amber-900">{state.message}</p>
          <p className="mt-2 text-sm leading-7 text-amber-900">
            Required fields are marked in the form below.
          </p>
        </div>
      ) : null}

      <form
        action={formAction}
        encType={allowInitialPhoto ? "multipart/form-data" : undefined}
        className="flex flex-col gap-6"
      >
        <div
          className={`grid gap-5 ${
            step === "review" && state.status !== "error" ? "hidden" : ""
          }`}
        >
          {allowInitialPhoto ? (
            <FormSection icon={<CameraIcon className="h-5 w-5" />} title="Photo">
              <div className="grid gap-3">
                <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
                  <span>{startsWithPhoto ? "Start with a photo" : "Optional photo"}</span>
                  <input
                    name="initialPhoto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    className="w-full rounded-[1rem] border border-[color:var(--border)] bg-white/85 px-4 py-3 text-sm font-normal text-[color:var(--foreground)] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--foreground)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                  />
                </label>
                <p className="text-sm leading-6 text-[color:var(--muted)]">
                  A photo helps you recognize this plant. Identification suggestions stay optional
                  and are not part of this save step.
                </p>
              </div>
            </FormSection>
          ) : null}

          <FormSection icon={<LeafIcon className="h-5 w-5" />} title="Plant identity">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Nickname"
                name="nickname"
                value={values.nickname}
                onChange={(value) => updateField("nickname", value)}
                error={fieldErrors.nickname}
                placeholder="Kitchen pothos"
                requiredHint="Required if no common name"
              />
              <FormField
                label="Common name"
                name="commonName"
                value={values.commonName}
                onChange={(value) => updateField("commonName", value)}
                error={fieldErrors.commonName}
                placeholder="Pothos"
                requiredHint="Required if no nickname"
              />
              <FormField
                label="Scientific name"
                name="scientificName"
                value={values.scientificName}
                onChange={(value) => updateField("scientificName", value)}
                placeholder="Epipremnum aureum"
              />
              <RoomSelectField
                rooms={rooms}
                value={values.roomId}
                onChange={(value) => updateField("roomId", value)}
                error={fieldErrors.roomId}
              />
              <FormField
                label="Add a new room"
                name="newRoomName"
                value={values.newRoomName}
                onChange={(value) => updateField("newRoomName", value)}
                error={fieldErrors.newRoomName}
                placeholder="Sunroom"
              />
              <FormField
                label="Legacy location note"
                name="location"
                value={values.location}
                onChange={(value) => updateField("location", value)}
                placeholder="Kitchen shelf"
              />
            </div>
          </FormSection>

          <FormSection icon={<DropletIcon className="h-5 w-5" />} title="Watering guidance">
            <div className="grid gap-4">
              <FormField
                label="Watering interval in days"
                name="wateringIntervalDays"
                value={values.wateringIntervalDays}
                onChange={(value) => updateField("wateringIntervalDays", value)}
                error={fieldErrors.wateringIntervalDays}
                placeholder="7"
              />
            <FormField
              label="Watering guidance"
              name="wateringGuidance"
              value={values.wateringGuidance}
              onChange={(value) => updateField("wateringGuidance", value)}
              placeholder="Let the top inch dry out first."
              rows={4}
            />
            </div>
          </FormSection>

          <FormSection icon={<RoomIcon className="h-5 w-5" />} title="Notes">
            <div className="grid gap-4">
            <FormField
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={(value) => updateField("notes", value)}
              placeholder="Repotted last month and seems happy near the window."
              rows={5}
            />
            </div>
          </FormSection>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep("review")}
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Review what will be saved
            </button>
          </div>
        </div>

        <section
          className={`rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6 ${
            step === "edit" || state.status === "error" ? "hidden" : ""
          }`}
        >
          <div className="grid gap-x-6 sm:grid-cols-2">
            <ReviewItem label="Nickname" value={values.nickname} />
            <ReviewItem label="Common name" value={values.commonName} />
            <ReviewItem label="Scientific name" value={values.scientificName} />
            <ReviewItem label="Room" value={selectedRoomLabel} emptyLabel="Unassigned" />
            <ReviewItem label="Legacy location note" value={values.location} />
            <ReviewItem
              label="Watering interval"
              value={
                values.wateringIntervalDays.trim().length > 0
                  ? `${values.wateringIntervalDays.trim()} day(s)`
                  : ""
              }
            />
            <ReviewItem label="Watering guidance" value={values.wateringGuidance} />
            <ReviewItem label="Notes" value={values.notes} />
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--stone)] p-5">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Before you save</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
              <li>
                This is a user-reviewed plant record
                {allowInitialPhoto ? " with an optional photo." : "."}
              </li>
              <li>AI suggestions are saved only after you review and accept them.</li>
              <li>No reminders have been scheduled yet.</li>
              <li>Watering guidance stays editable and can be changed later.</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep("edit")}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            >
              Back to editing
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : submitLabel}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
