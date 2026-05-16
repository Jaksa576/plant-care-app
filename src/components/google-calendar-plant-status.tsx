import Link from "next/link";

import { CalendarIcon } from "@/components/icons";
import { StatusPill } from "@/components/status-pill";
import type {
  GoogleCalendarConnectionRecord,
  GoogleCalendarEventLinkRecord,
} from "@/lib/plants/types";

type GoogleCalendarPlantStatusProps = {
  configured: boolean;
  connection: GoogleCalendarConnectionRecord | null;
  eventLink: GoogleCalendarEventLinkRecord | null;
  reminderEnabled: boolean;
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

export function GoogleCalendarPlantStatus({
  configured,
  connection,
  eventLink,
  reminderEnabled,
}: GoogleCalendarPlantStatusProps) {
  if (!reminderEnabled && !eventLink && !connection) {
    return null;
  }

  const connected = Boolean(connection);
  const hasSyncedEvent = Boolean(eventLink);
  const statusLabel = !configured
    ? "Calendar not configured"
    : hasSyncedEvent
      ? "Calendar mirrored"
      : connected
        ? "Calendar connected"
        : "Calendar not connected";
  const statusTone = !configured ? "warning" : hasSyncedEvent || connected ? "success" : "default";
  const syncDate = formatDate(eventLink?.last_synced_at ?? connection?.last_synced_at ?? null);
  const syncIssue = eventLink?.last_sync_error ?? connection?.last_sync_error ?? null;

  return (
    <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
      <div className="flex flex-col gap-3">
        <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-[color:var(--accent)]" />
          <h3 className="text-xl font-semibold">Calendar status</h3>
        </div>
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          This plant&apos;s reminder stays in Plant Care. Google Calendar setup and disconnect
          controls are managed in Settings.
        </p>
        {reminderEnabled ? (
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            Reminder on
            {hasSyncedEvent ? " and mirrored to Google Calendar." : "."}
          </p>
        ) : null}
        {syncDate ? (
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            Last sync: <span className="font-semibold">{syncDate}</span>
          </p>
        ) : null}
        {syncIssue ? (
          <p className="text-sm leading-6 text-amber-950">Sync note: {syncIssue}</p>
        ) : null}
        <Link
          href="/app/settings"
          className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)]"
        >
          Manage in Settings
        </Link>
      </div>
    </section>
  );
}
