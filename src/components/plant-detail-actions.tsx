"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { WateringReminderState } from "@/app/app/plants/actions";
import { AlarmClockIcon, BellIcon, DropletIcon } from "@/components/icons";
import type { MarkWateredState } from "@/components/mark-watered-form";

const emptyWateredState: MarkWateredState = {
  status: "idle",
  message: null,
};

const emptyReminderState: WateringReminderState = {
  status: "idle",
  message: null,
};

type PlantDetailActionsProps = {
  waterAction: (state: MarkWateredState, formData: FormData) => Promise<MarkWateredState>;
  snoozeAction: (state: WateringReminderState, formData: FormData) => Promise<WateringReminderState>;
  canSnooze: boolean;
};

export function PlantDetailActions({
  waterAction,
  snoozeAction,
  canSnooze,
}: PlantDetailActionsProps) {
  const [waterState, waterFormAction, waterPending] = useActionState(
    waterAction,
    emptyWateredState,
  );
  const [snoozeState, snoozeFormAction, snoozePending] = useActionState(
    snoozeAction,
    emptyReminderState,
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      <form action={waterFormAction} className="col-span-1">
        <button
          type="submit"
          disabled={waterPending}
          className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-2xl bg-[color:var(--accent)] px-3 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(46,125,83,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <DropletIcon className="h-5 w-5" />
          {waterPending ? "Saving" : "Water now"}
        </button>
      </form>

      <form action={snoozeFormAction} className="col-span-1">
        <input type="hidden" name="snoozeDays" value="1" />
        <button
          type="submit"
          disabled={!canSnooze || snoozePending}
          className="flex min-h-16 w-full flex-col items-center justify-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <AlarmClockIcon className="h-5 w-5" />
          {snoozePending ? "Snoozing" : "Snooze"}
        </button>
      </form>

      <Link
        href="#watering-reminder"
        className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-3 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
      >
        <BellIcon className="h-5 w-5" />
        Reminder
      </Link>

      {waterState.message || snoozeState.message ? (
        <p
          className={`col-span-3 text-sm leading-6 ${
            waterState.status === "error" || snoozeState.status === "error"
              ? "text-[color:var(--attention)]"
              : "text-[color:var(--accent)]"
          }`}
        >
          {waterState.message ?? snoozeState.message}
        </p>
      ) : null}
    </div>
  );
}
