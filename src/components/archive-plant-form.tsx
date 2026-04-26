"use client";

import { useTransition } from "react";

import { StatusPill } from "@/components/status-pill";

type ArchivePlantFormProps = {
  action: () => Promise<void>;
  showError: boolean;
};

export function ArchivePlantForm({ action, showError }: ArchivePlantFormProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <section className="rounded-[2rem] border border-amber-200 bg-amber-50/80 p-6 shadow-[var(--shadow)] sm:p-8">
      <StatusPill tone="warning">Archive plant</StatusPill>
      <h3 className="mt-5 text-2xl font-semibold">Hide this plant from the main collection</h3>
      <p className="mt-3 text-sm leading-7 text-amber-950/80 sm:text-base">
        Archiving removes this plant from the default list without hard-deleting the record.
        This is just a collection cleanup step. It does not schedule reminders, identify the
        plant, or create watering history.
      </p>

      {showError ? (
        <p className="mt-4 text-sm leading-7 text-amber-900">
          We couldn&apos;t archive this plant just now. Please try again.
        </p>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          onClick={() => {
            startTransition(async () => {
              await action();
            });
          }}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white/90 px-5 py-3 text-sm font-semibold text-amber-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Archiving..." : "Archive this plant"}
        </button>
      </div>
    </section>
  );
}
