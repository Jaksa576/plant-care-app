"use client";

import { useActionState } from "react";

import type { WateringReminderState } from "@/app/app/plants/actions";
import { StatusPill } from "@/components/status-pill";

const emptyReminderState: WateringReminderState = {
  status: "idle",
  message: null,
};

type WateringReminderPanelProps = {
  enabled: boolean;
  summaryLabel: string;
  helperText: string;
  dateInputValue: string;
  saveAction: (state: WateringReminderState, formData: FormData) => Promise<WateringReminderState>;
  disableAction: (
    state: WateringReminderState,
    formData: FormData,
  ) => Promise<WateringReminderState>;
};

function ReminderMessage({ state }: { state: WateringReminderState }) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      className={`rounded-[1.25rem] border px-4 py-3 text-sm leading-6 ${
        state.status === "error"
          ? "border-amber-200 bg-amber-50 text-amber-950"
          : "border-emerald-200 bg-emerald-50 text-emerald-950"
      }`}
    >
      {state.message}
    </div>
  );
}

export function WateringReminderPanel({
  enabled,
  summaryLabel,
  helperText,
  dateInputValue,
  saveAction,
  disableAction,
}: WateringReminderPanelProps) {
  const [saveState, saveFormAction, savePending] = useActionState(
    saveAction,
    emptyReminderState,
  );
  const [disableState, disableFormAction, disablePending] = useActionState(
    disableAction,
    emptyReminderState,
  );

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
      <div className="flex flex-col gap-3">
        <StatusPill tone={enabled ? "success" : "default"}>
          {enabled ? "Reminder on" : "Reminder off"}
        </StatusPill>
        <h3 className="text-2xl font-semibold">Watering reminder</h3>
        <p className="text-lg font-semibold">{summaryLabel}</p>
        <p className="text-sm leading-7 text-[color:var(--muted)]">{helperText}</p>
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          This reminder lives in Plant Care. It does not send push, email, or SMS notifications.
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <ReminderMessage state={saveState} />
        <ReminderMessage state={disableState} />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <form action={saveFormAction} className="flex flex-col gap-3">
          <label className="flex max-w-sm flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
            Next reminder date
            <input
              type="date"
              name="nextReminderDate"
              defaultValue={dateInputValue}
              className="rounded-[1rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-[color:var(--accent)]"
            />
          </label>
          <button
            type="submit"
            disabled={savePending}
            className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savePending ? "Saving..." : enabled ? "Update reminder" : "Turn reminder on"}
          </button>
        </form>

        {enabled ? (
          <form action={disableFormAction}>
            <button
              type="submit"
              disabled={disablePending}
              className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {disablePending ? "Pausing..." : "Turn reminder off"}
            </button>
          </form>
        ) : null}
      </div>
    </section>
  );
}
