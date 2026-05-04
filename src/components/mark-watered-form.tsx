"use client";

import { useActionState } from "react";

import { StatusPill } from "@/components/status-pill";

export type MarkWateredState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const emptyMarkWateredState: MarkWateredState = {
  status: "idle",
  message: null,
};

type MarkWateredFormProps = {
  action: (state: MarkWateredState, formData: FormData) => Promise<MarkWateredState>;
};

export function MarkWateredForm({ action }: MarkWateredFormProps) {
  const [state, formAction, isPending] = useActionState(action, emptyMarkWateredState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message ? (
        <div
          className={`rounded-[1.25rem] border px-4 py-3 ${
            state.status === "error"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-emerald-200 bg-emerald-50 text-emerald-950"
          }`}
        >
          <StatusPill tone={state.status === "error" ? "warning" : "success"}>
            {state.status === "error" ? "Watering not recorded" : "Watering recorded"}
          </StatusPill>
          <p className="mt-3 text-sm leading-6">{state.message}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Recording..." : "Mark watered"}
      </button>
    </form>
  );
}
