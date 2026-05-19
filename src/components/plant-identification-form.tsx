"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type {
  ApplyCareSuggestionState,
  PlantIdentificationState,
  SavePlantIdentificationState,
} from "@/app/app/plants/actions";
import { CameraIcon, LeafIcon } from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type { CareProfileMatchType } from "@/lib/care-profiles/types";
import type { PlantIdentificationCandidate } from "@/lib/plant-identification/types";

const emptyIdentificationState: PlantIdentificationState = {
  status: "idle",
  message: null,
  candidates: [],
};

const emptySaveState: SavePlantIdentificationState = {
  status: "idle",
  message: null,
  careProfilePreview: null,
};

const emptyApplyCareSuggestionState: ApplyCareSuggestionState = {
  status: "idle",
  message: null,
  reminderHandoff: null,
};

type PlantIdentificationPanelProps = {
  hasPhoto: boolean;
  editHref: string;
  hasExistingWateringBasics: boolean;
  identifyAction: (
    state: PlantIdentificationState,
    formData: FormData,
  ) => Promise<PlantIdentificationState>;
  saveSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
  fallbackCareSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
  applyCareSuggestionAction: (
    state: ApplyCareSuggestionState,
    formData: FormData,
  ) => Promise<ApplyCareSuggestionState>;
};

type CandidateReviewFormProps = {
  candidate: PlantIdentificationCandidate;
  editHref: string;
  hasExistingWateringBasics: boolean;
  saveSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
  fallbackCareSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
  applyCareSuggestionAction: (
    state: ApplyCareSuggestionState,
    formData: FormData,
  ) => Promise<ApplyCareSuggestionState>;
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

function getMatchTypeLabel(matchType: CareProfileMatchType) {
  if (matchType === "scientific") {
    return "Exact care profile match";
  }

  if (matchType === "synonym") {
    return "Synonym care profile match";
  }

  if (matchType === "common") {
    return "Common-name care profile match";
  }

  if (matchType === "genus") {
    return "Genus care profile match";
  }

  return "Care-group profile match";
}

function getDrynessPreferenceLabel(preference: string) {
  if (preference === "dry_fully") {
    return "Let the soil dry fully before watering.";
  }

  if (preference === "dry_mostly") {
    return "Let most of the soil dry before watering.";
  }

  if (preference === "dry_top_half") {
    return "Let the top half of the soil dry before watering.";
  }

  if (preference === "dry_top_inch") {
    return "Let the top inch of soil dry before watering.";
  }

  if (preference === "lightly_moist") {
    return "Keep lightly moist, but not soggy.";
  }

  if (preference === "evenly_moist") {
    return "Keep evenly moist and check often.";
  }

  if (preference === "special_medium") {
    return "Follow medium-specific guidance, such as bark mix.";
  }

  return "Start conservatively and adjust based on how this plant dries in your home.";
}

function CareSuggestionActions({
  preview,
  editHref,
  hasExistingWateringBasics,
  applyCareSuggestionAction,
}: {
  preview: Extract<SavePlantIdentificationState["careProfilePreview"], { status: "matched" }>;
  editHref: string;
  hasExistingWateringBasics: boolean;
  applyCareSuggestionAction: (
    state: ApplyCareSuggestionState,
    formData: FormData,
  ) => Promise<ApplyCareSuggestionState>;
}) {
  const [state, formAction, isPending] = useActionState(
    applyCareSuggestionAction,
    emptyApplyCareSuggestionState,
  );
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <p className="mt-4 rounded-[1rem] border border-[color:var(--border-soft)] bg-white/75 px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
        Care suggestion skipped. Manual care basics remain available from Edit.
      </p>
    );
  }

  return (
    <div className="mt-4">
      {state.message ? (
        <div
          className={`mb-3 rounded-[1rem] border px-4 py-3 text-sm leading-6 ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          {state.message}
          {state.status === "success" && state.reminderHandoff ? (
            <div className="mt-3">
              <a
                href="#watering-reminder"
                className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-100"
              >
                {state.reminderHandoff.label}
              </a>
              <p className="mt-2 text-xs leading-5">
                Reminders stay optional and use Plant Care&apos;s existing reminder settings.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="cadenceDays" value={preview.cadenceDays} />
        <input type="hidden" name="wateringGuidance" value={preview.wateringGuidance} />

        {hasExistingWateringBasics ? (
          <label className="flex items-start gap-3 rounded-[1rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            <input
              type="checkbox"
              name="confirmOverwrite"
              className="mt-1 h-4 w-4 rounded border-amber-300"
            />
            <span>
              Replace the watering basics already saved for this plant. Existing notes and
              identity fields will not change.
            </span>
          </label>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isPending || state.status === "success"}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Applying..." : "Use these care basics"}
          </button>
          <Link
            href={editHref}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
          >
            Edit first
          </Link>
          <button
            type="button"
            onClick={() => setSkipped(true)}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
}

function CareProfilePreviewCard({
  preview,
  editHref,
  hasExistingWateringBasics,
  fallbackCareSuggestionAction,
  applyCareSuggestionAction,
}: {
  preview: SavePlantIdentificationState["careProfilePreview"];
  editHref: string;
  hasExistingWateringBasics: boolean;
  fallbackCareSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
  applyCareSuggestionAction: (
    state: ApplyCareSuggestionState,
    formData: FormData,
  ) => Promise<ApplyCareSuggestionState>;
}) {
  if (!preview) {
    return null;
  }

  if (preview.status === "matched") {
    const cadenceRange =
      preview.cadenceDaysMin && preview.cadenceDaysMax
        ? `Range: ${preview.cadenceDaysMin}-${preview.cadenceDaysMax} days.`
        : null;

    const rangeLabel =
      preview.cadenceDaysMin && preview.cadenceDaysMax
        ? `${preview.cadenceDaysMin}-${preview.cadenceDaysMax} day range`
        : "No range needed";

    return (
      <div className="mt-4 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--stone)] p-4 text-sm leading-6">
        <StatusPill>{getMatchTypeLabel(preview.matchType)}</StatusPill>
        <p className="mt-3 text-base font-semibold text-[color:var(--foreground)]">
          Suggested watering starting point
        </p>
        <p className="mt-1 font-semibold text-[color:var(--foreground)]">{preview.displayName}</p>
        <dl className="mt-3 grid gap-2 text-[color:var(--muted)]">
          <div>
            <dt className="font-semibold text-[color:var(--foreground)]">Check cadence</dt>
            <dd>
              Start by checking every {preview.cadenceDays} days. {cadenceRange}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[color:var(--foreground)]">Dryness preference</dt>
            <dd>{getDrynessPreferenceLabel(preview.drynessPreference)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[color:var(--foreground)]">Watering guidance</dt>
            <dd>{preview.wateringGuidance}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs font-semibold text-[color:var(--muted)]">
          {rangeLabel}. This is a starting point for your home conditions, not a guaranteed
          watering schedule.
        </p>
        <CareSuggestionActions
          preview={preview}
          editHref={editHref}
          hasExistingWateringBasics={hasExistingWateringBasics}
          applyCareSuggestionAction={applyCareSuggestionAction}
        />
      </div>
    );
  }

  if (preview.status === "ambiguous") {
    return (
      <div className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <p className="font-semibold">A few care profiles could match.</p>
        <p className="mt-2">
          Choose manually for now, or keep setup manual until the plant identity is clearer.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {preview.options.map((option) => (
            <li key={`${option.displayName}-${option.drynessPreference}`}>
              {option.displayName}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--stone)] p-4 text-sm leading-6 text-[color:var(--muted)]">
      <p>No internal care profile matched yet. You can keep setup manual for now.</p>
      <FallbackCareQuestionForm
        editHref={editHref}
        hasExistingWateringBasics={hasExistingWateringBasics}
        fallbackCareSuggestionAction={fallbackCareSuggestionAction}
        applyCareSuggestionAction={applyCareSuggestionAction}
      />
    </div>
  );
}

function FallbackCareQuestionForm({
  editHref,
  hasExistingWateringBasics,
  fallbackCareSuggestionAction,
  applyCareSuggestionAction,
}: {
  editHref: string;
  hasExistingWateringBasics: boolean;
  fallbackCareSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
  applyCareSuggestionAction: (
    state: ApplyCareSuggestionState,
    formData: FormData,
  ) => Promise<ApplyCareSuggestionState>;
}) {
  const [state, formAction, isPending] = useActionState(
    fallbackCareSuggestionAction,
    emptySaveState,
  );

  return (
    <div className="mt-4 rounded-[1rem] border border-[color:var(--border-soft)] bg-white/80 p-4">
      <p className="font-semibold text-[color:var(--foreground)]">
        Try a basic plant profile
      </p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
        Not sure what this plant is? Choose the closest type and we&apos;ll suggest a simple watering
        starting point.
      </p>

      <form action={formAction} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
          Closest visible trait
          <select
            name="fallbackCareAnswer"
            defaultValue=""
            className="min-h-[var(--tap-target)] rounded-[1rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
          >
            <option value="" disabled>
              Choose a basic profile
            </option>
            <option value="cactus">Cactus or very dry plant</option>
            <option value="succulent">Thick, fleshy leaves</option>
            <option value="orchid">Orchid or bark mix</option>
            <option value="fern">Fern-like, soft fronds</option>
            <option value="moisture_loving">Seems to prefer staying lightly moist</option>
            <option value="palm">Palm-like plant</option>
            <option value="tropical">Leafy tropical plant</option>
            <option value="unknown">Not sure; start cautiously</option>
          </select>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Preparing..." : "Use basic profile"}
          </button>
          <Link
            href={editHref}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
          >
            Set up manually
          </Link>
        </div>
      </form>

      {state.message ? (
        <div
          className={`mt-4 rounded-[1rem] border px-4 py-3 text-sm leading-6 ${
            state.status === "error"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-emerald-200 bg-emerald-50 text-emerald-950"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      {state.careProfilePreview?.status === "matched" ? (
        <CareProfilePreviewCard
          preview={state.careProfilePreview}
          editHref={editHref}
          hasExistingWateringBasics={hasExistingWateringBasics}
          fallbackCareSuggestionAction={fallbackCareSuggestionAction}
          applyCareSuggestionAction={applyCareSuggestionAction}
        />
      ) : null}
    </div>
  );
}

function CandidateReviewForm({
  candidate,
  editHref,
  hasExistingWateringBasics,
  saveSuggestionAction,
  fallbackCareSuggestionAction,
  applyCareSuggestionAction,
}: CandidateReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveSuggestionAction,
    emptySaveState,
  );

  return (
    <div className="rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-4">
      <form action={formAction}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <StatusPill>
              {getConfidenceText(candidate.confidenceLabel)} · {getConfidencePercent(candidate)}
            </StatusPill>
            <h4 className="mt-3 text-lg font-semibold">{candidate.scientificName}</h4>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
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
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Common name
            <input
              name="commonName"
              defaultValue={candidate.commonName ?? ""}
              className="min-h-[var(--tap-target)] rounded-[1rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Scientific name
            <input
              name="scientificName"
              defaultValue={candidate.scientificName}
              className="min-h-[var(--tap-target)] rounded-[1rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base font-normal italic outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
            />
          </label>
        </div>

        {state.message ? (
          <div
            className={`mt-4 rounded-[1.25rem] border px-4 py-3 text-sm leading-6 ${
              state.status === "error"
                ? "border-amber-200 bg-amber-50 text-amber-950"
                : "border-emerald-200 bg-emerald-50 text-emerald-950"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save reviewed names"}
          </button>
          {state.status === "success" ? (
            <Link
              href={editHref}
              className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
            >
              Edit full plant details
            </Link>
          ) : null}
        </div>
      </form>

      <CareProfilePreviewCard
        preview={state.careProfilePreview}
        editHref={editHref}
        hasExistingWateringBasics={hasExistingWateringBasics}
        fallbackCareSuggestionAction={fallbackCareSuggestionAction}
        applyCareSuggestionAction={applyCareSuggestionAction}
      />

    </div>
  );
}

export function PlantIdentificationPanel({
  hasPhoto,
  editHref,
  hasExistingWateringBasics,
  identifyAction,
  saveSuggestionAction,
  fallbackCareSuggestionAction,
  applyCareSuggestionAction,
}: PlantIdentificationPanelProps) {
  const [state, formAction, isPending] = useActionState(
    identifyAction,
    emptyIdentificationState,
  );

  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusPill>Optional helper</StatusPill>
          <div className="mt-4 flex items-center gap-2">
            <LeafIcon className="h-5 w-5 text-[color:var(--accent)]" />
            <h3 className="text-xl font-semibold">Help identify this plant</h3>
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            These are suggestions, not certainties. Accepted names stay editable, and care basics
            are only applied if you review and choose them.
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Saving reviewed names checks Plant Care&apos;s internal profiles for an optional
            watering starting point.
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
            Low-confidence results may need a clearer leaf photo in natural light, or you can keep
            setup manual.
          </p>
          <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">
            Plant suggestions powered by Pl@ntNet.
          </p>
        </div>
      </div>

      {!hasPhoto ? (
        <div className="mt-5 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
          Add a photo before asking for identification help.
        </div>
      ) : (
        <form action={formAction} className="mt-5">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CameraIcon className="h-4 w-4" />
            {isPending ? "Checking possible matches..." : "Help identify this plant"}
          </button>
        </form>
      )}

      {state.message ? (
        <div
          className={`mt-5 rounded-[1.25rem] border px-4 py-3 text-sm leading-6 ${
            state.status === "error" || state.status === "no-candidates"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-emerald-200 bg-emerald-50 text-emerald-950"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      {state.candidates.length > 0 ? (
        <div className="mt-5 grid gap-4">
          {state.candidates.map((candidate) => (
            <CandidateReviewForm
              key={`${candidate.scientificName}-${candidate.commonName ?? "no-common"}`}
              candidate={candidate}
              editHref={editHref}
              hasExistingWateringBasics={hasExistingWateringBasics}
              saveSuggestionAction={saveSuggestionAction}
              fallbackCareSuggestionAction={fallbackCareSuggestionAction}
              applyCareSuggestionAction={applyCareSuggestionAction}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        <Link
          href={editHref}
          className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
        >
          Keep editing manually
        </Link>
      </div>
    </section>
  );
}
