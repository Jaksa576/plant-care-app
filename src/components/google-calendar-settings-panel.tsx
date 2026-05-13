"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { GoogleCalendarActionState } from "@/app/app/integrations/google-calendar/actions";
import { CalendarIcon } from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type { GoogleCalendarConnectionRecord } from "@/lib/plants/types";

const emptyGoogleCalendarState: GoogleCalendarActionState = {
  status: "idle",
  message: null,
};

type GoogleCalendarSettingsPanelProps = {
  configured: boolean;
  connection: GoogleCalendarConnectionRecord | null;
  linkedEventCount: number;
  latestEventSync: {
    status: string;
    error: string | null;
    syncedAt: string | null;
  } | null;
  queryStatus?: string;
  disconnectAction: (
    state: GoogleCalendarActionState,
    formData?: FormData,
  ) => Promise<GoogleCalendarActionState>;
};

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getQueryStatusMessage(status?: string) {
  switch (status) {
    case "connected":
      return {
        tone: "success" as const,
        message: "Google Calendar connected. Future app-owned reminders can be mirrored.",
      };
    case "missing-config":
      return {
        tone: "warning" as const,
        message: "Google Calendar sync is not configured on this server yet.",
      };
    case "connect-canceled":
      return {
        tone: "warning" as const,
        message: "Google Calendar connection was canceled. Plant Care reminders are unchanged.",
      };
    case "state-error":
    case "token-error":
    case "save-error":
      return {
        tone: "warning" as const,
        message: "Google Calendar could not be connected. Plant Care reminders are unchanged.",
      };
    default:
      return null;
  }
}

function CalendarActionMessage({ state }: { state: GoogleCalendarActionState }) {
  if (!state.message) {
    return null;
  }

  const tone = state.status === "success" ? "success" : "warning";

  return (
    <div className="rounded-2xl border border-[color:var(--border-soft)] bg-white/70 p-4">
      <StatusPill tone={tone}>{state.status === "success" ? "Updated" : "Attention"}</StatusPill>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{state.message}</p>
    </div>
  );
}

export function GoogleCalendarSettingsPanel({
  configured,
  connection,
  linkedEventCount,
  latestEventSync,
  queryStatus,
  disconnectAction,
}: GoogleCalendarSettingsPanelProps) {
  const [disconnectState, disconnectFormAction, disconnectPending] = useActionState(
    disconnectAction,
    emptyGoogleCalendarState,
  );
  const connected = Boolean(connection);
  const queryMessage = getQueryStatusMessage(queryStatus);
  const statusLabel = !configured
    ? "Not configured"
    : connected
      ? "Connected"
      : "Not connected";
  const statusTone = connected ? "success" : configured ? "default" : "warning";
  const latestSyncDate =
    formatDate(connection?.last_synced_at ?? null) ?? formatDate(latestEventSync?.syncedAt ?? null);
  const syncIssue = connection?.last_sync_error ?? latestEventSync?.error ?? null;

  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1 text-[color:var(--accent)]">
          <CalendarIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Reminders & Calendar</h2>
            <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
          </div>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Plant Care reminders stay in Plant Care. Google Calendar is a one-way reflection
            of enabled watering reminders.
          </p>

          {queryMessage ? (
            <div className="mt-4 rounded-2xl border border-[color:var(--border-soft)] bg-white/70 p-4">
              <StatusPill tone={queryMessage.tone}>
                {queryMessage.tone === "success" ? "Connected" : "Attention"}
              </StatusPill>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {queryMessage.message}
              </p>
            </div>
          ) : null}

          {!configured ? (
            <p className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              Add the Google OAuth and token encryption environment variables on the server to
              enable calendar sync.
            </p>
          ) : null}

          {connected ? (
            <div className="mt-5 grid gap-3 text-sm leading-6 text-[color:var(--muted)]">
              <p>
                Mirrored reminders: <span className="font-semibold">{linkedEventCount}</span>
              </p>
              <p>
                Last sync:{" "}
                <span className="font-semibold">
                  {latestSyncDate ?? "No successful sync recorded yet"}
                </span>
              </p>
              <p>
                Sync status:{" "}
                <span className="font-semibold">
                  {(connection?.last_sync_status ?? latestEventSync?.status ?? "idle").replace(
                    "_",
                    " ",
                  )}
                </span>
              </p>
              {syncIssue ? <p className="text-amber-950">Sync note: {syncIssue}</p> : null}
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">
              Connect only if you want upcoming Plant Care reminders reflected on your primary
              Google Calendar.
            </p>
          )}

          <div className="mt-5 grid gap-4">
            <CalendarActionMessage state={disconnectState} />
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

            {connected ? (
              <form action={disconnectFormAction}>
                <button
                  type="submit"
                  disabled={disconnectPending}
                  className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {disconnectPending ? "Disconnecting..." : "Disconnect Google Calendar"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
