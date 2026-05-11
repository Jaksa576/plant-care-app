"use client";

import { useActionState } from "react";

import type { WateringReminderState } from "@/app/app/plants/actions";
import { AlarmClockIcon, DropletIcon } from "@/components/icons";
import type { MarkWateredState } from "@/components/mark-watered-form";

const emptyWateredState: MarkWateredState = {
  status: "idle",
  message: null,
};

const emptyReminderState: WateringReminderState = {
  status: "idle",
  message: null,
};

type TodayWaterButtonProps = {
  action: (state: MarkWateredState, formData: FormData) => Promise<MarkWateredState>;
};

export function TodayWaterButton({ action }: TodayWaterButtonProps) {
  const [state, formAction, isPending] = useActionState(action, emptyWateredState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={isPending}
        aria-label="Mark watered"
        className="inline-flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] items-center justify-center rounded-xl bg-[color:var(--accent)] px-3 text-white shadow-[0_10px_22px_rgba(46,125,83,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <DropletIcon className="h-5 w-5" />
      </button>
      {state.message ? (
        <span
          className={`max-w-32 text-right text-[0.7rem] leading-4 ${
            state.status === "error" ? "text-[color:var(--attention)]" : "text-[color:var(--accent)]"
          }`}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}

type TodaySnoozeButtonProps = {
  action: (state: WateringReminderState, formData: FormData) => Promise<WateringReminderState>;
  disabled?: boolean;
};

export function TodaySnoozeButton({ action, disabled = false }: TodaySnoozeButtonProps) {
  const [state, formAction, isPending] = useActionState(action, emptyReminderState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="snoozeDays" value="1" />
      <button
        type="submit"
        disabled={disabled || isPending}
        aria-label="Snooze watering reminder by 1 day"
        className="inline-flex min-h-[var(--tap-target)] min-w-[var(--tap-target)] items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <AlarmClockIcon className="h-5 w-5" />
      </button>
      {state.message ? (
        <span
          className={`max-w-32 text-right text-[0.7rem] leading-4 ${
            state.status === "error" ? "text-[color:var(--attention)]" : "text-[color:var(--accent)]"
          }`}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
