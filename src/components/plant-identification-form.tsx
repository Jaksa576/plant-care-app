"use client";

import Link from "next/link";
import { useActionState } from "react";

import type {
  PlantIdentificationState,
  SavePlantIdentificationState,
} from "@/app/app/plants/actions";
import { StatusPill } from "@/components/status-pill";
import type { PlantIdentificationCandidate } from "@/lib/plant-identification/types";

const emptyIdentificationState: PlantIdentificationState = {
  status: "idle",
  message: null,
  candidates: [],
};

const emptySaveState: SavePlantIdentificationState = {
  status: "idle",
  message: null,
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
  if (label === "likely") {
    return "likely";
  }

  if (label === "possible") {
    return "possible";
  }

  return "not sure";
}

function CandidateReviewForm({ candidate, editHref, saveSuggestionAction }: CandidateReviewFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveSuggestionAction,
    emptySaveState,
  );

  return (
    <form
      action={formAction}
      className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/85 p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusPill>{getConfidenceText(candidate.confidenceLabel)}</StatusPill>
          <h4 className="mt-3 text-lg font-semibold">{candidate.scientificName}</h4>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            {candidate.commonName ?? "No common name returned"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Common name
          <input
            name="commonName"
            defaultValue={candidate.commonName ?? ""}
            className="rounded-[1rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[color:var(--accent)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Scientific name
          <input
            name="scientificName"
            defaultValue={candidate.scientificName}
            className="rounded-[1rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base font-normal italic outline-none transition focus:border-[color:var(--accent)]"
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
          className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save reviewed names"}
        </button>
        {state.status === "success" ? (
          <Link
            href={editHref}
            className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
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
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusPill>Optional helper</StatusPill>
          <h3 className="mt-5 text-2xl font-semibold">Help identify this plant</h3>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
            These are suggestions, not certainties. Accepted names stay editable and care
            guidance will not be changed.
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
            className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
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
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
        >
          Keep editing manually
        </Link>
      </div>
    </section>
  );
}
