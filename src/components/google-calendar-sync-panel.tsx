"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { GoogleCalendarActionState } from "@/app/app/integrations/google-calendar/actions";
import { CalendarIcon } from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type {
  GoogleCalendarConnectionRecord,
  GoogleCalendarEventLinkRecord,
} from "@/lib/plants/types";

const emptyGoogleCalendarState: GoogleCalendarActionState = {
  status: "idle",
  message: null,
};

type GoogleCalendarSyncPanelProps = {
  configured: boolean;
  connection: GoogleCalendarConnectionRecord | null;
  eventLink: GoogleCalendarEventLinkRecord | null;
  reminderEnabled: boolean;
  syncAction: (
    state: GoogleCalendarActionState,
    formData?: FormData,
  ) => Promise<GoogleCalendarActionState>;
  disconnectAction: (
    state: GoogleCalendarActionState,
    formData?: FormData,
  ) => Promise<GoogleCalendarActionState>;
};

function CalendarMessage({ state }: { state: GoogleCalendarActionState }) {
  if (!state.message) {
    return null;
  }

  const isWarning = state.status === "warning" || state.status === "error";

  return (
    <div
      className={`rounded-[1.25rem] border px-4 py-3 text-sm leading-6 ${
        isWarning
          ? "border-amber-200 bg-amber-50 text-amber-950"
          : "border-emerald-200 bg-emerald-50 text-emerald-950"
      }`}
    >
      {state.message}
    </div>
  );
}

export function GoogleCalendarSyncPanel({
  configured,
  connection,
  eventLink,
  reminderEnabled,
  syncAction,
  disconnectAction,
}: GoogleCalendarSyncPanelProps) {
  const [syncState, syncFormAction, syncPending] = useActionState(
    syncAction,
    emptyGoogleCalendarState,
  );
  const [disconnectState, disconnectFormAction, disconnectPending] = useActionState(
    disconnectAction,
    emptyGoogleCalendarState,
  );
  const connected = Boolean(connection);
  const statusLabel = !configured
    ? "Not configured"
    : connected
      ? "Google connected"
      : "Not connected";
  const statusTone = connected ? "success" : configured ? "default" : "warning";

  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
      <div className="flex flex-col gap-3">
        <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[color:var(--accent)]" />
          <h3 className="text-xl font-semibold">Google Calendar</h3>
        </div>
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          Mirror this watering reminder to your primary Google Calendar. Plant Care stays the
          source of truth.
        </p>
        {!configured ? (
          <p className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
            Google Calendar sync is not configured on this server yet.
          </p>
        ) : null}
        {eventLink ? (
          <p className="text-sm leading-7 text-[color:var(--muted)]">
            Last sync status: {eventLink.last_sync_status.replace("_", " ")}
            {eventLink.last_synced_at ? ` on ${new Date(eventLink.last_synced_at).toLocaleDateString()}` : ""}
          </p>
        ) : null}
        {connection?.last_sync_error ? (
          <p className="text-sm leading-7 text-amber-950">
            Last sync note: {connection.last_sync_error}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        <CalendarMessage state={syncState} />
        <CalendarMessage state={disconnectState} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {configured && !connected ? (
          <Link
            href="/app/integrations/google-calendar/connect"
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Connect Google Calendar
          </Link>
        ) : null}

        {configured && connected ? (
          <form action={syncFormAction}>
            <button
              type="submit"
              disabled={syncPending || !reminderEnabled}
              className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {syncPending ? "Updating..." : "Update calendar"}
            </button>
          </form>
        ) : null}

        {connected ? (
          <form action={disconnectFormAction}>
            <button
              type="submit"
              disabled={disconnectPending}
              className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {disconnectPending ? "Disconnecting..." : "Disconnect"}
            </button>
          </form>
        ) : null}
      </div>

      {configured && connected && !reminderEnabled ? (
        <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
          Turn on the Plant Care reminder before adding it to Google Calendar.
        </p>
      ) : null}
    </section>
  );
}
