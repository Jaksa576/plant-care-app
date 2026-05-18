"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";

import { CameraIcon, DropletIcon, LeafIcon, RoomIcon } from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type { PlantIdentificationState } from "@/app/app/plants/actions";
import type { PlantIdentificationCandidate } from "@/lib/plant-identification/types";
import {
  emptyPlantFormState,
  type PlantFormState,
  type PlantFormValues,
} from "@/lib/plants/types";
import { getPlantPhotoValidationError, PLANT_PHOTO_MAX_MB } from "@/lib/plants/photos";
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
  identifyInitialPhotoAction?: (
    state: PlantIdentificationState,
    formData: FormData,
  ) => Promise<PlantIdentificationState>;
};

type ReviewItemProps = {
  label: string;
  value: string;
  emptyLabel?: string;
};

type PlantFormStep = "details" | "room" | "watering" | "review";
type RoomChoice = "unassigned" | "existing" | "new";

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
          Required before saving.
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

function RoomChoiceField({
  rooms,
  choice,
  roomId,
  newRoomName,
  onChoiceChange,
  onRoomIdChange,
  onNewRoomNameChange,
  error,
}: {
  rooms: PlantRoomRecord[];
  choice: RoomChoice;
  roomId: string;
  newRoomName: string;
  onChoiceChange: (choice: RoomChoice) => void;
  onRoomIdChange: (value: string) => void;
  onNewRoomNameChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="grid gap-4">
      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-[color:var(--foreground)]">
          Where does this plant live?
        </legend>
        <label className="flex gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 p-4 text-sm leading-6">
          <input
            type="radio"
            name="roomChoice"
            checked={choice === "unassigned"}
            onChange={() => onChoiceChange("unassigned")}
            className="mt-1"
          />
          <span>
            <span className="block font-semibold">Unassigned</span>
            <span className="text-[color:var(--muted)]">Add a room later if you want.</span>
          </span>
        </label>
        <label className="flex gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 p-4 text-sm leading-6">
          <input
            type="radio"
            name="roomChoice"
            checked={choice === "existing"}
            onChange={() => onChoiceChange("existing")}
            disabled={rooms.length === 0}
            className="mt-1"
          />
          <span>
            <span className="block font-semibold">Choose existing room</span>
            <span className="text-[color:var(--muted)]">
              {rooms.length > 0
                ? "Use one of your saved rooms."
                : "Create a room first, or add a new one here."}
            </span>
          </span>
        </label>
        <label className="flex gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 p-4 text-sm leading-6">
          <input
            type="radio"
            name="roomChoice"
            checked={choice === "new"}
            onChange={() => onChoiceChange("new")}
            className="mt-1"
          />
          <span>
            <span className="block font-semibold">Add new room</span>
            <span className="text-[color:var(--muted)]">
              Save a room name and assign this plant to it.
            </span>
          </span>
        </label>
      </fieldset>

      {choice === "existing" ? (
        <RoomSelectField
          rooms={rooms}
          value={roomId}
          onChange={onRoomIdChange}
          error={error}
        />
      ) : null}

      {choice === "new" ? (
        <FormField
          label="New room name"
          name="newRoomName"
          value={newRoomName}
          onChange={onNewRoomNameChange}
          error={error}
          placeholder="Sunroom"
        />
      ) : null}
    </div>
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

const emptyIdentificationState: PlantIdentificationState = {
  status: "idle",
  message: null,
  candidates: [],
};

function getConfidenceText(label: PlantIdentificationCandidate["confidenceLabel"]) {
  if (label === "strong") {
    return "Strong match";
  }

  if (label === "possible") {
    return "Possible match";
  }

  return "Low-confidence match";
}

function getConfidencePercent(candidate: PlantIdentificationCandidate) {
  return `${Math.round(Math.max(0, Math.min(candidate.confidenceScore, 1)) * 100)}%`;
}

function InitialPhotoIdentificationControls({
  identifyAction,
  selectedPhoto,
  photoError,
  onAcceptCandidate,
}: {
  identifyAction: (
    state: PlantIdentificationState,
    formData: FormData,
  ) => Promise<PlantIdentificationState>;
  selectedPhoto: File | null;
  photoError: string | null;
  onAcceptCandidate: (candidate: PlantIdentificationCandidate) => void;
}) {
  const [state, identifyFormAction, isPending] = useActionState(
    identifyAction,
    emptyIdentificationState,
  );
  const [isIdentifyTransitionPending, startIdentifyTransition] = useTransition();
  const [showCandidates, setShowCandidates] = useState(true);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const hasCandidates = state.candidates.length > 0 && showCandidates;
  const identifyPending = isPending || isIdentifyTransitionPending;

  function handleIdentifyClick() {
    setShowCandidates(true);
    setReviewMessage(null);

    if (!selectedPhoto) {
      setLocalMessage("Choose a photo before asking for identification help.");
      return;
    }

    if (photoError) {
      setLocalMessage(photoError);
      return;
    }

    const formData = new FormData();
    formData.set("initialPhoto", selectedPhoto, selectedPhoto.name);
    setLocalMessage(null);
    startIdentifyTransition(() => {
      identifyFormAction(formData);
    });
  }

  return (
    <div className="mt-4 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-white/75 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[color:var(--foreground)]">
            Optional identification help
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Plant suggestions are names only. Scores are match signals, not certainty. Choose one
            to fill editable fields, retry with a clearer photo, or continue manually.
          </p>
          <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
            Plant suggestions powered by Pl@ntNet.
          </p>
        </div>
        <button
          type="button"
          disabled={identifyPending}
          onClick={handleIdentifyClick}
          className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CameraIcon className="h-4 w-4" />
          {identifyPending ? "Checking..." : "Identify from photo"}
        </button>
      </div>

      {localMessage ? (
        <div className="mt-4 rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          {localMessage}
        </div>
      ) : null}

      {state.message ? (
        <div
          className={`mt-4 rounded-[1rem] border px-4 py-3 text-sm leading-6 ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      {hasCandidates ? (
        <div className="mt-4 grid gap-3">
          {state.candidates.map((candidate) => (
            <div
              key={`${candidate.scientificName}-${candidate.commonName ?? "no-common"}`}
              className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <StatusPill>
                    {getConfidenceText(candidate.confidenceLabel)} ·{" "}
                    {getConfidencePercent(candidate)}
                  </StatusPill>
                  <p className="mt-3 text-base font-semibold">{candidate.scientificName}</p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                    {candidate.commonName ?? "No common name returned"}
                  </p>
                  {candidate.alternateScientificNames.length > 0 ? (
                    <details className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      <summary className="cursor-pointer font-semibold text-[color:var(--foreground)]">
                        {candidate.alternateScientificNames.length} similar scientific match
                        {candidate.alternateScientificNames.length === 1 ? "" : "es"} considered
                      </summary>
                      <ul className="mt-2 list-disc space-y-1 pl-5 italic">
                        {candidate.alternateScientificNames.map((scientificName) => (
                          <li key={scientificName}>{scientificName}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAcceptCandidate(candidate);
                    setReviewMessage(
                      "Suggestion copied into the editable name fields. Review it before saving.",
                    );
                  }}
                  className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
                >
                  Use these names
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowCandidates(false);
              setReviewMessage("Suggestions rejected. Continue with manual plant details.");
            }}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
          >
            Continue manually
          </button>
        </div>
      ) : null}

      {reviewMessage ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-[color:var(--foreground)]">
          {reviewMessage}
        </p>
      ) : null}
    </div>
  );
}

function getFirstErrorStep(fieldErrors: PlantFormState["fieldErrors"]): PlantFormStep | null {
  if (fieldErrors.nickname || fieldErrors.commonName || fieldErrors.scientificName) {
    return "details";
  }

  if (fieldErrors.roomId || fieldErrors.newRoomName) {
    return "room";
  }

  if (fieldErrors.wateringIntervalDays) {
    return "watering";
  }

  return null;
}

export function PlantForm({
  action,
  submitLabel,
  title,
  description,
  initialValues,
  rooms = [],
  allowInitialPhoto = false,
  identifyInitialPhotoAction,
}: PlantFormProps) {
  const startingState = {
    ...emptyPlantFormState,
    values: initialValues ?? emptyPlantFormState.values,
  };
  const [state, formAction, isPending] = useActionState(action, startingState);
  const steps: PlantFormStep[] = ["details", "room", "watering", "review"];
  const [step, setStep] = useState<PlantFormStep>(steps[0]);
  const [values, setValues] = useState<PlantFormValues>(startingState.values);
  const [roomChoice, setRoomChoice] = useState<RoomChoice>(
    startingState.values.newRoomName
      ? "new"
      : startingState.values.roomId
        ? "existing"
        : "unassigned",
  );
  const [selectedInitialPhoto, setSelectedInitialPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitTransitionPending, startSubmitTransition] = useTransition();

  const fieldErrors = state.fieldErrors;
  const submitPending = isPending || isSubmitTransitionPending;
  const errorStep =
    state.status === "error" && step === "review" ? getFirstErrorStep(fieldErrors) : null;
  const visibleStep = errorStep ?? step;
  const currentStepIndex = steps.indexOf(visibleStep);
  const currentStepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
  const isFirstStep = visibleStep === steps[0];
  const isReviewStep = visibleStep === "review";

  const photoPreviewUrl = useMemo(
    () => (selectedInitialPhoto ? URL.createObjectURL(selectedInitialPhoto) : null),
    [selectedInitialPhoto],
  );

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  function updateField(name: keyof PlantFormValues, value: string) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function acceptIdentificationCandidate(candidate: PlantIdentificationCandidate) {
    setValues((current) => ({
      ...current,
      commonName: candidate.commonName ?? current.commonName,
      scientificName: candidate.scientificName,
    }));
  }

  function handleInitialPhotoChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    setSelectedInitialPhoto(file);
    setPhotoError(file ? getPlantPhotoValidationError(file) : null);
  }

  function updateRoomChoice(nextChoice: RoomChoice) {
    setRoomChoice(nextChoice);

    if (nextChoice === "unassigned") {
      setValues((current) => ({
        ...current,
        roomId: "",
        newRoomName: "",
      }));
    }

    if (nextChoice === "existing") {
      setValues((current) => ({
        ...current,
        newRoomName: "",
      }));
    }

    if (nextChoice === "new") {
      setValues((current) => ({
        ...current,
        roomId: "",
      }));
    }
  }

  function goToNextStep() {
    const index = steps.indexOf(visibleStep);

    if (index < steps.length - 1) {
      setStep(steps[index + 1]);
    }
  }

  function goToPreviousStep() {
    const index = steps.indexOf(visibleStep);

    if (index > 0) {
      setStep(steps[index - 1]);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!allowInitialPhoto) {
      return;
    }

    event.preventDefault();

    if (photoError) {
      setStep("details");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("nickname", values.nickname);
    formData.set("commonName", values.commonName);
    formData.set("scientificName", values.scientificName);
    formData.set("location", values.location);
    formData.set("roomId", roomChoice === "existing" ? values.roomId : "");
    formData.set("newRoomName", roomChoice === "new" ? values.newRoomName : "");
    formData.set("wateringIntervalDays", values.wateringIntervalDays);
    formData.set("wateringGuidance", values.wateringGuidance);
    formData.set("notes", values.notes);

    if (selectedInitialPhoto) {
      formData.set("initialPhoto", selectedInitialPhoto, selectedInitialPhoto.name);
    }

    startSubmitTransition(() => {
      formAction(formData);
    });
  }

  const selectedRoomLabel =
    values.newRoomName.trim() ||
    rooms.find((room) => room.id === values.roomId)?.name ||
    "Unassigned";

  return (
    <div className="flex flex-col gap-6">
      <section className="border-b border-[color:var(--border-soft)] pb-5">
        <StatusPill>
          {isReviewStep
            ? "Review before save"
            : allowInitialPhoto
              ? "Photo-first setup"
              : "Plant details"}
        </StatusPill>
        <h2 className="mt-4 text-3xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
          {description}
        </p>
        <div className="mt-4 inline-flex w-fit items-center rounded-full border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--muted)]">
          Step {currentStepNumber} of {steps.length}
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
        onSubmit={handleSubmit}
        encType={allowInitialPhoto ? "multipart/form-data" : undefined}
        className="flex flex-col gap-6"
      >
        <input type="hidden" name="nickname" value={values.nickname} />
        <input type="hidden" name="commonName" value={values.commonName} />
        <input type="hidden" name="scientificName" value={values.scientificName} />
        <input type="hidden" name="location" value={values.location} />
        <input type="hidden" name="roomId" value={roomChoice === "existing" ? values.roomId : ""} />
        <input
          type="hidden"
          name="newRoomName"
          value={roomChoice === "new" ? values.newRoomName : ""}
        />
        <input
          type="hidden"
          name="wateringIntervalDays"
          value={values.wateringIntervalDays}
        />
        <input type="hidden" name="wateringGuidance" value={values.wateringGuidance} />
        <input type="hidden" name="notes" value={values.notes} />
        <div
          className={`grid gap-5 ${
            isReviewStep && state.status !== "error" ? "hidden" : ""
          }`}
        >
          {visibleStep === "details" ? (
            <FormSection
              icon={<LeafIcon className="h-5 w-5" />}
              title={allowInitialPhoto ? "Photo & plant name" : "Plant name"}
            >
              <div className="grid gap-3">
                {allowInitialPhoto ? (
                  <>
                    <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
                      <span>Optional photo</span>
                      <input
                        name="initialPhoto"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        capture="environment"
                        onChange={(event) => handleInitialPhotoChange(event.target.files)}
                        className="w-full rounded-[1rem] border border-[color:var(--border)] bg-white/85 px-4 py-3 text-sm font-normal text-[color:var(--foreground)] outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--foreground)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                      />
                    </label>
                    {photoPreviewUrl ? (
                      <div className="overflow-hidden rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--stone)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photoPreviewUrl}
                          alt="Selected plant photo preview"
                          className="h-64 w-full object-cover sm:h-80"
                        />
                        <div className="border-t border-[color:var(--border-soft)] px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
                          {selectedInitialPhoto?.name ?? "Selected photo"} will be used for
                          identification and saved as this plant&apos;s primary photo.
                        </div>
                      </div>
                    ) : null}
                    {photoError ? (
                      <div className="rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                        {photoError}
                      </div>
                    ) : null}
                    <p className="text-sm leading-6 text-[color:var(--muted)]">
                      A photo helps you recognize this plant. Identification suggestions stay
                      optional, names-only, and editable before saving. Use a JPG, PNG, or WebP
                      image under {PLANT_PHOTO_MAX_MB} MB.
                    </p>
                    {identifyInitialPhotoAction ? (
                      <InitialPhotoIdentificationControls
                        identifyAction={identifyInitialPhotoAction}
                        selectedPhoto={selectedInitialPhoto}
                        photoError={photoError}
                        onAcceptCandidate={acceptIdentificationCandidate}
                      />
                    ) : null}
                  </>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Nickname"
                    name="nickname"
                    value={values.nickname}
                    onChange={(value) => updateField("nickname", value)}
                    error={fieldErrors.nickname}
                    placeholder="Kitchen pothos"
                    requiredHint="Required"
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
                </div>
              </div>
            </FormSection>
          ) : null}

          {visibleStep === "room" ? (
            <FormSection icon={<RoomIcon className="h-5 w-5" />} title="Room">
              <RoomChoiceField
                rooms={rooms}
                choice={roomChoice}
                roomId={values.roomId}
                newRoomName={values.newRoomName}
                onChoiceChange={updateRoomChoice}
                onRoomIdChange={(value) => updateField("roomId", value)}
                onNewRoomNameChange={(value) => updateField("newRoomName", value)}
                error={fieldErrors.roomId ?? fieldErrors.newRoomName}
              />
            </FormSection>
          ) : null}

          {visibleStep === "watering" ? (
            <FormSection icon={<DropletIcon className="h-5 w-5" />} title="Watering basics">
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
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            {!isFirstStep ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={goToNextStep}
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              {steps.indexOf(visibleStep) === steps.length - 2 ? "Review and save" : "Continue"}
            </button>
          </div>
        </div>

        <section
          className={`rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6 ${
            !isReviewStep || state.status === "error" ? "hidden" : ""
          }`}
        >
          <div className="grid gap-x-6 sm:grid-cols-2">
            <ReviewItem label="Nickname" value={values.nickname} />
            <ReviewItem label="Common name" value={values.commonName} />
            <ReviewItem label="Scientific name" value={values.scientificName} />
            <ReviewItem label="Room" value={selectedRoomLabel} emptyLabel="Unassigned" />
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
                {allowInitialPhoto ? " with a photo if you added one." : "."}
              </li>
              <li>AI suggestions are saved only after you review and accept them.</li>
              <li>No reminders have been scheduled yet.</li>
              <li>Watering guidance stays editable and can be changed later.</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            >
              Back to editing
            </button>
            <button
              type="submit"
              disabled={submitPending}
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitPending ? "Saving..." : submitLabel}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
