import Link from "next/link";

import { StatusPill } from "@/components/status-pill";
import { getPlantPrimaryLabel, getPlantSecondaryLabel } from "@/lib/plants/presenters";
import type { PlantRecord } from "@/lib/plants/types";

type PlantCardProps = {
  plant: PlantRecord;
};

export function PlantCard({ plant }: PlantCardProps) {
  const primaryLabel = getPlantPrimaryLabel(plant);
  const secondaryLabel = getPlantSecondaryLabel(plant);

  return (
    <article className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Plant record
          </p>
          <h3 className="mt-3 text-xl font-semibold text-[color:var(--foreground)]">
            {primaryLabel}
          </h3>
          {secondaryLabel ? (
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{secondaryLabel}</p>
          ) : null}
        </div>

        <StatusPill>{plant.watering_interval_days ? "Guidance added" : "Manual entry"}</StatusPill>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {plant.location ? (
          <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Location
            </p>
            <p className="mt-2 text-sm leading-6">{plant.location}</p>
          </div>
        ) : null}

        {plant.scientific_name ? (
          <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Scientific name
            </p>
            <p className="mt-2 text-sm leading-6 italic">{plant.scientific_name}</p>
          </div>
        ) : null}

        {plant.watering_interval_days ? (
          <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Watering interval
            </p>
            <p className="mt-2 text-sm leading-6">
              Every {plant.watering_interval_days} day{plant.watering_interval_days === 1 ? "" : "s"}
            </p>
          </div>
        ) : null}

        {plant.watering_guidance ? (
          <div className="rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Watering guidance
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              {plant.watering_guidance}
            </p>
          </div>
        ) : null}
      </div>

      {plant.notes ? (
        <div className="mt-4 rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Notes
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{plant.notes}</p>
        </div>
      ) : null}

      <div className="mt-5">
        <Link
          href={`/app/plants/${plant.id}/edit`}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          Edit plant
        </Link>
      </div>
    </article>
  );
}
