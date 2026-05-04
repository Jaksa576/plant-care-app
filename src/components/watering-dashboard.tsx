import Link from "next/link";

import { markWateredAction } from "@/app/app/plants/actions";
import { MarkWateredForm } from "@/components/mark-watered-form";
import { PlantPhotoFrame } from "@/components/plant-photo";
import { StatusPill } from "@/components/status-pill";
import { getPlantPrimaryLabel, getPlantSecondaryLabel } from "@/lib/plants/presenters";
import type { DashboardPlant } from "@/lib/watering/dashboard";

type DashboardSectionProps = {
  title: string;
  description: string;
  emptyMessage: string;
  plants: DashboardPlant[];
  photoUrls: Record<string, string>;
  showAction?: boolean;
};

type DashboardPlantCardProps = {
  item: DashboardPlant;
  photoUrl?: string;
  showAction: boolean;
};

function DashboardPlantCard({ item, photoUrl, showAction }: DashboardPlantCardProps) {
  const primaryLabel = getPlantPrimaryLabel(item.plant);
  const secondaryLabel = getPlantSecondaryLabel(item.plant);

  return (
    <article className="rounded-[1.5rem] border border-[color:var(--border)] bg-white/85 p-4 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <Link href={`/app/plants/${item.plant.id}`} aria-label={`Open ${primaryLabel}`}>
            <PlantPhotoFrame
              photoUrl={photoUrl}
              alt={photoUrl ? `${primaryLabel} primary plant photo` : ""}
              variant="thumbnail"
            />
          </Link>
          <div className="min-w-0">
            <Link href={`/app/plants/${item.plant.id}`} className="group block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Plant
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[color:var(--foreground)] transition group-hover:text-[color:var(--accent)]">
                {primaryLabel}
              </h3>
            </Link>
            {secondaryLabel ? (
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{secondaryLabel}</p>
            ) : null}
            {item.plant.location ? (
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {item.plant.location}
              </p>
            ) : null}
          </div>
        </div>
        <StatusPill tone={item.schedule.status === "overdue" ? "warning" : "default"}>
          {item.schedule.nextWateringLabel}
        </StatusPill>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Last watered
          </p>
          <p className="mt-2 text-sm leading-6">{item.schedule.lastWateredLabel}</p>
        </div>
        <div className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
            Guidance
          </p>
          <p className="mt-2 text-sm leading-6">
            {item.plant.watering_interval_days
              ? `Every ${item.plant.watering_interval_days} day${
                  item.plant.watering_interval_days === 1 ? "" : "s"
                }`
              : "No interval set"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={`/app/plants/${item.plant.id}`}
          className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
        >
          Open profile
        </Link>
        {showAction ? <MarkWateredForm action={markWateredAction.bind(null, item.plant.id)} /> : null}
      </div>
    </article>
  );
}

export function DashboardSection({
  title,
  description,
  emptyMessage,
  plants,
  photoUrls,
  showAction = false,
}: DashboardSectionProps) {
  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm leading-7 text-[color:var(--muted)]">{description}</p>
      </div>

      {plants.length > 0 ? (
        <div className="mt-5 grid gap-4">
          {plants.map((item) => (
            <DashboardPlantCard
              key={item.plant.id}
              item={item}
              photoUrl={photoUrls[item.plant.id]}
              showAction={showAction}
            />
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
