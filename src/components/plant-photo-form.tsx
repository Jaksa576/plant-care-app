"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import type { FormEvent } from "react";

import type { PlantPhotoState } from "@/app/app/plants/actions";
import { CameraIcon } from "@/components/icons";
import { PlantPhotoStatus } from "@/components/plant-photo";
import { getPlantPhotoValidationError, PLANT_PHOTO_MAX_MB } from "@/lib/plants/photos";

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
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const libraryPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const cameraPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadTransitionPending, startUploadTransition] = useTransition();
  const isUploading = uploadPending || isUploadTransitionPending;

  function handlePhotoChange(fileList: FileList | null, source: "library" | "camera") {
    const file = fileList?.[0] ?? null;

    if (source === "library" && cameraPhotoInputRef.current) {
      cameraPhotoInputRef.current.value = "";
    }

    if (source === "camera" && libraryPhotoInputRef.current) {
      libraryPhotoInputRef.current.value = "";
    }

    setSelectedPhoto(file);
    setLocalError(file ? getPlantPhotoValidationError(file) : null);
  }

  function handleUploadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = getPlantPhotoValidationError(selectedPhoto);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    if (!selectedPhoto) {
      setLocalError("Choose a plant photo before uploading.");
      return;
    }

    const formData = new FormData();
    formData.set("photo", selectedPhoto, selectedPhoto.name);
    setLocalError(null);
    startUploadTransition(() => {
      uploadFormAction(formData);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {localError ? (
        <PlantPhotoStatus status="error" message={localError} />
      ) : null}
      {uploadState.message ? (
        <PlantPhotoStatus status={uploadState.status === "error" ? "error" : "success"} message={uploadState.message} />
      ) : null}
      {removeState.message ? (
        <PlantPhotoStatus status={removeState.status === "error" ? "error" : "success"} message={removeState.message} />
      ) : null}

      <form onSubmit={handleUploadSubmit} className="flex flex-col gap-3">
        <fieldset className="grid gap-3">
          <legend className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground)]">
            <CameraIcon className="h-4 w-4 text-[color:var(--accent)]" />
            {hasPhoto ? "Replace primary photo" : "Add primary photo"}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 p-4 text-sm leading-6 transition hover:bg-[color:var(--accent-soft)]">
              <span className="font-semibold">Choose from library</span>
              <span className="text-[color:var(--muted)]">
                Pick an existing JPG or PNG photo from this device.
              </span>
              <input
                ref={libraryPhotoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                disabled={isUploading}
                onChange={(event) => handlePhotoChange(event.target.files, "library")}
                className="w-full text-sm font-normal text-[color:var(--foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
            <label className="flex cursor-pointer flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border)] bg-white/80 p-4 text-sm leading-6 transition hover:bg-[color:var(--accent-soft)]">
              <span className="font-semibold">Take a photo</span>
              <span className="text-[color:var(--muted)]">
                Open the device camera where your browser supports it.
              </span>
              <input
                ref={cameraPhotoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                disabled={isUploading}
                onChange={(event) => handlePhotoChange(event.target.files, "camera")}
                className="w-full text-sm font-normal text-[color:var(--foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[color:var(--accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>
          </div>
          <p className="text-sm leading-6 text-[color:var(--muted)]">
            Use a JPG or PNG image under {PLANT_PHOTO_MAX_MB} MB. WebP is not supported
            for plant identification yet.
          </p>
        </fieldset>
        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : hasPhoto ? "Replace photo" : "Add photo"}
        </button>
      </form>

      {hasPhoto ? (
        <form action={removeFormAction}>
          <button
            type="submit"
            disabled={removePending}
            className="inline-flex min-h-[var(--tap-target)] w-fit items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {removePending ? "Removing..." : "Remove photo"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
