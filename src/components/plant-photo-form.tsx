"use client";

import { useActionState } from "react";

import type { PlantPhotoState } from "@/app/app/plants/actions";
import { PlantPhotoStatus } from "@/components/plant-photo";

const emptyPhotoState: PlantPhotoState = {
  status: "idle",
  message: null,
};

type PlantPhotoFormProps = {
  uploadAction: (state: PlantPhotoState, formData: FormData) => Promise<PlantPhotoState>;
  removeAction: (state: PlantPhotoState, formData: FormData) => Promise<PlantPhotoState>;
  hasPhoto: boolean;
};

export function PlantPhotoForm({ uploadAction, removeAction, hasPhoto }: PlantPhotoFormProps) {
  const [uploadState, uploadFormAction, uploadPending] = useActionState(
    uploadAction,
    emptyPhotoState,
  );
  const [removeState, removeFormAction, removePending] = useActionState(
    removeAction,
    emptyPhotoState,
  );

  return (
    <div className="flex flex-col gap-4">
      {uploadState.message ? (
        <PlantPhotoStatus status={uploadState.status === "error" ? "error" : "success"} message={uploadState.message} />
      ) : null}
      {removeState.message ? (
        <PlantPhotoStatus status={removeState.status === "error" ? "error" : "success"} message={removeState.message} />
      ) : null}

      <form action={uploadFormAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
          {hasPhoto ? "Replace primary photo" : "Add primary photo"}
          <input
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            disabled={uploadPending}
            className="w-full rounded-[1rem] border border-[color:var(--border)] bg-white/85 px-4 py-3 text-sm font-normal text-[color:var(--foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={uploadPending}
          className="inline-flex w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploadPending ? "Uploading..." : hasPhoto ? "Replace photo" : "Add photo"}
        </button>
      </form>

      {hasPhoto ? (
        <form action={removeFormAction}>
          <button
            type="submit"
            disabled={removePending}
            className="inline-flex w-fit items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {removePending ? "Removing..." : "Remove photo"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
