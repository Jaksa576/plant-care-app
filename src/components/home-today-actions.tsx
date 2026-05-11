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
        className="inline-flex min-h-[3.25rem] min-w-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-xl bg-[color:var(--accent)] px-2 py-1.5 text-[0.68rem] font-semibold leading-none text-white shadow-[0_10px_22px_rgba(46,125,83,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-[color:var(--sage)] disabled:text-white disabled:opacity-70"
      >
        <DropletIcon className="h-5 w-5" />
        <span>Water</span>
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
        className="inline-flex min-h-[3.25rem] min-w-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-2 py-1.5 text-[0.68rem] font-semibold leading-none text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:bg-[color:var(--stone)] disabled:text-[color:var(--muted)] disabled:opacity-70"
      >
        <AlarmClockIcon className="h-5 w-5" />
        <span>Snooze</span>
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
