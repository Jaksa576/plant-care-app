"use client";

import { useActionState, useState } from "react";

import { StatusPill } from "@/components/status-pill";
import {
  emptyPlantFormState,
  type PlantFormState,
  type PlantFormValues,
} from "@/lib/plants/types";

type PlantFormProps = {
  action: (state: PlantFormState, formData: FormData) => Promise<PlantFormState>;
  submitLabel: string;
  title: string;
  description: string;
  initialValues?: PlantFormValues;
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
}: {
  label: string;
  name: keyof PlantFormValues;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  const sharedClassName =
    "rounded-[1.25rem] border bg-white px-4 py-3 text-base outline-none transition focus:border-[color:var(--accent)]";
  const className = `${sharedClassName} ${
    error
      ? "border-amber-400 bg-amber-50/70"
      : "border-[color:var(--border)]"
  }`;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
      {label}
      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={className}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
        />
      )}
      {error ? <span className="text-sm text-amber-900">{error}</span> : null}
    </label>
  );
}

function ReviewItem({ label, value, emptyLabel = "Not added yet" }: ReviewItemProps) {
  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
        {value.trim().length > 0 ? value : emptyLabel}
      </p>
    </div>
  );
}

export function PlantForm({
  action,
  submitLabel,
  title,
  description,
  initialValues,
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

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
        <StatusPill>{step === "edit" ? "Manual entry" : "Review before save"}</StatusPill>
        <h2 className="mt-5 text-3xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          {description}
        </p>
      </section>

      {state.message ? (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4">
          <StatusPill tone="warning">Something needs attention</StatusPill>
          <p className="mt-3 text-sm leading-7 text-amber-900">{state.message}</p>
        </div>
      ) : null}

      <form action={formAction} className="flex flex-col gap-6">
        <section
          className={`rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8 ${
            step === "review" ? "hidden" : ""
          }`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nickname"
              name="nickname"
              value={values.nickname}
              onChange={(value) => updateField("nickname", value)}
              error={fieldErrors.nickname}
              placeholder="Kitchen pothos"
            />
            <FormField
              label="Common name"
              name="commonName"
              value={values.commonName}
              onChange={(value) => updateField("commonName", value)}
              error={fieldErrors.commonName}
              placeholder="Pothos"
            />
            <FormField
              label="Scientific name"
              name="scientificName"
              value={values.scientificName}
              onChange={(value) => updateField("scientificName", value)}
              placeholder="Epipremnum aureum"
            />
            <FormField
              label="Room or location"
              name="location"
              value={values.location}
              onChange={(value) => updateField("location", value)}
              placeholder="Kitchen shelf"
            />
            <FormField
              label="Watering interval in days"
              name="wateringIntervalDays"
              value={values.wateringIntervalDays}
              onChange={(value) => updateField("wateringIntervalDays", value)}
              error={fieldErrors.wateringIntervalDays}
              placeholder="7"
            />
          </div>

          <div className="mt-4 grid gap-4">
            <FormField
              label="Watering guidance"
              name="wateringGuidance"
              value={values.wateringGuidance}
              onChange={(value) => updateField("wateringGuidance", value)}
              placeholder="Let the top inch dry out first."
              rows={4}
            />
            <FormField
              label="Notes"
              name="notes"
              value={values.notes}
              onChange={(value) => updateField("notes", value)}
              placeholder="Repotted last month and seems happy near the window."
              rows={5}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep("review")}
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Review what will be saved
            </button>
          </div>
        </section>

        <section
          className={`rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8 ${
            step === "edit" ? "hidden" : ""
          }`}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ReviewItem label="Nickname" value={values.nickname} />
            <ReviewItem label="Common name" value={values.commonName} />
            <ReviewItem label="Scientific name" value={values.scientificName} />
            <ReviewItem label="Room or location" value={values.location} />
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

          <div className="mt-6 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Before you save
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
              <li>This is a manually entered plant record.</li>
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
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : submitLabel}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
