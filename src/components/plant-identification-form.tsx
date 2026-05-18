"use client";

import Link from "next/link";
import { useActionState } from "react";

import type {
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

type PlantIdentificationPanelProps = {
  hasPhoto: boolean;
  editHref: string;
  identifyAction: (
    state: PlantIdentificationState,
    formData: FormData,
  ) => Promise<PlantIdentificationState>;
  saveSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
};

type CandidateReviewFormProps = {
  candidate: PlantIdentificationCandidate;
  editHref: string;
  saveSuggestionAction: (
    state: SavePlantIdentificationState,
    formData: FormData,
  ) => Promise<SavePlantIdentificationState>;
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

function CareProfilePreviewCard({
  preview,
}: {
  preview: SavePlantIdentificationState["careProfilePreview"];
}) {
  if (!preview) {
    return null;
  }

  if (preview.status === "matched") {
    const cadenceRange =
      preview.cadenceDaysMin && preview.cadenceDaysMax
        ? `Range: ${preview.cadenceDaysMin}-${preview.cadenceDaysMax} days.`
        : null;

    return (
      <div className="mt-4 rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--stone)] p-4 text-sm leading-6">
        <StatusPill>{getMatchTypeLabel(preview.matchType)}</StatusPill>
        <p className="mt-3 font-semibold text-[color:var(--foreground)]">{preview.displayName}</p>
        <p className="mt-2 text-[color:var(--muted)]">
          Preview only: start by checking every {preview.cadenceDays} days. {cadenceRange}
        </p>
        <p className="mt-2 text-[color:var(--muted)]">{preview.wateringGuidance}</p>
        <p className="mt-2 text-xs font-semibold text-[color:var(--muted)]">
          Nothing was applied to watering basics.
        </p>
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
      No internal care profile matched yet. You can keep setup manual for now.
    </div>
  );
}

function CandidateReviewForm({ candidate, editHref, saveSuggestionAction }: CandidateReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveSuggestionAction,
    emptySaveState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-4"
    >
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

      <CareProfilePreviewCard preview={state.careProfilePreview} />

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
  );
}

export function PlantIdentificationPanel({
  hasPhoto,
  editHref,
  identifyAction,
  saveSuggestionAction,
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
            These are suggestions, not certainties. Accepted names stay editable and care
            guidance will not be changed.
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
              saveSuggestionAction={saveSuggestionAction}
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
