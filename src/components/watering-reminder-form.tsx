"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

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
  previewText: string;
  dateInputValue: string;
  mode: "after_watering" | "fixed_schedule";
  canUseReminderTiming: boolean;
  googleCalendarConnected: boolean;
  saveAction: (state: WateringReminderState, formData: FormData) => Promise<WateringReminderState>;
  disableAction: (
    state: WateringReminderState,
    formData: FormData,
  ) => Promise<WateringReminderState>;
  snoozeAction: (
    state: WateringReminderState,
    formData: FormData,
  ) => Promise<WateringReminderState>;
};

type ReminderActionName = "save" | "disable" | "snooze";

function ReminderMessage({
  state,
  actionName,
  latestAction,
}: {
  state: WateringReminderState;
  actionName: ReminderActionName;
  latestAction: ReminderActionName | null;
}) {
  if (!state.message) {
    return null;
  }

  if (latestAction && latestAction !== actionName) {
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
  previewText,
  dateInputValue,
  mode,
  canUseReminderTiming,
  googleCalendarConnected,
  saveAction,
  disableAction,
  snoozeAction,
}: WateringReminderPanelProps) {
  const initialMode =
    mode === "after_watering" && !canUseReminderTiming ? "fixed_schedule" : mode;
  const [saveState, saveFormAction, savePending] = useActionState(
    saveAction,
    emptyReminderState,
  );
  const [disableState, disableFormAction, disablePending] = useActionState(
    disableAction,
    emptyReminderState,
  );
  const [snoozeState, snoozeFormAction, snoozePending] = useActionState(
    snoozeAction,
    emptyReminderState,
  );
  const [latestAction, setLatestAction] = useState<ReminderActionName | null>(null);
  const [selectedMode, setSelectedMode] = useState<"after_watering" | "fixed_schedule">(
    initialMode,
  );
  const effectiveSelectedMode =
    selectedMode === "after_watering" && !canUseReminderTiming ? "fixed_schedule" : selectedMode;

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)] sm:p-8">
      <div className="flex flex-col gap-3">
        <StatusPill tone={enabled ? "success" : "default"}>
          {enabled ? "Reminder on" : "Reminder off"}
        </StatusPill>
        <h3 className="text-2xl font-semibold">Watering reminder</h3>
        <p className="text-lg font-semibold">{summaryLabel}</p>
        <p className="text-sm leading-7 text-[color:var(--muted)]">{helperText}</p>
        <p className="text-sm leading-7 text-[color:var(--muted)]">{previewText}</p>
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          This reminder lives in Plant Care. It does not send push, email, or SMS notifications.
        </p>
        <div className="mt-1 flex flex-col gap-2 rounded-[1rem] border border-[color:var(--border-soft)] bg-white/75 px-4 py-3 text-sm leading-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[color:var(--foreground)]">
              Google Calendar: {googleCalendarConnected ? "connected" : "not connected"}
            </p>
            <p className="text-[color:var(--muted)]">Managed in Settings.</p>
          </div>
          <Link
            href="/app/settings"
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
          >
            Manage in Settings
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <ReminderMessage state={saveState} actionName="save" latestAction={latestAction} />
        <ReminderMessage
          state={disableState}
          actionName="disable"
          latestAction={latestAction}
        />
        <ReminderMessage
          state={snoozeState}
          actionName="snooze"
          latestAction={latestAction}
        />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <form
          action={saveFormAction}
          className="flex flex-col gap-3"
          onSubmit={() => setLatestAction("save")}
        >
          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-[color:var(--foreground)]">
              How should reminders work?
            </legend>
            <label className="flex gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 p-4 text-sm leading-6 transition active:scale-[0.99]">
              <input
                type="radio"
                name="reminderMode"
                value="after_watering"
                checked={effectiveSelectedMode === "after_watering"}
                onChange={() => setSelectedMode("after_watering")}
                disabled={!canUseReminderTiming}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold">After I water</span>
                <span className="text-[color:var(--muted)]">
                  {canUseReminderTiming
                    ? "Recalculate from the latest watering date."
                    : "Add a watering interval in plant details to use this mode."}
                </span>
              </span>
            </label>
            <label className="flex gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/75 p-4 text-sm leading-6 transition active:scale-[0.99]">
              <input
                type="radio"
                name="reminderMode"
                value="fixed_schedule"
                checked={effectiveSelectedMode === "fixed_schedule"}
                onChange={() => setSelectedMode("fixed_schedule")}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold">Fixed schedule</span>
                <span className="text-[color:var(--muted)]">
                  Keep this next date when you water early.
                </span>
              </span>
            </label>
          </fieldset>
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
            className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition active:scale-[0.98] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savePending ? "Saving..." : enabled ? "Update reminder" : "Turn reminder on"}
          </button>
          {!canUseReminderTiming ? (
            <p className="text-sm leading-7 text-[color:var(--muted)]">
              Fixed schedule can still be saved. Add a watering interval in plant details to enable
              after-watering reminders.
            </p>
          ) : null}
        </form>

        {enabled ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <form action={snoozeFormAction} onSubmit={() => setLatestAction("snooze")}>
              <input type="hidden" name="snoozeDays" value="1" />
              <button
                type="submit"
                disabled={snoozePending}
                className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition active:scale-[0.98] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Snooze 1 day
              </button>
            </form>
            <form action={snoozeFormAction} onSubmit={() => setLatestAction("snooze")}>
              <input type="hidden" name="snoozeDays" value="3" />
              <button
                type="submit"
                disabled={snoozePending}
                className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition active:scale-[0.98] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Snooze 3 days
              </button>
            </form>
            <form action={disableFormAction} onSubmit={() => setLatestAction("disable")}>
              <button
                type="submit"
                disabled={disablePending}
                className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition active:scale-[0.98] hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {disablePending ? "Pausing..." : "Turn reminder off"}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </section>
  );
}
