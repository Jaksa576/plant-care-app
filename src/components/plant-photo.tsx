import { StatusPill } from "@/components/status-pill";

type PlantPhotoFrameProps = {
  photoUrl?: string | null;
  alt: string;
  variant?: "hero" | "thumbnail";
};

export function PlantPhotoFrame({ photoUrl, alt, variant = "hero" }: PlantPhotoFrameProps) {
  const isThumbnail = variant === "thumbnail";

  return (
    <div
      className={`relative overflow-hidden border border-[color:var(--border)] bg-[color:var(--accent-soft)] ${
        isThumbnail
          ? "h-16 w-16 shrink-0 rounded-[1rem]"
          : "aspect-[4/3] w-full rounded-[1.5rem] sm:aspect-[16/9]"
      }`}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#deebdf,#f5efe2)] px-3 text-center">
          <div>
            <div
              aria-hidden="true"
              className={`mx-auto rounded-full border border-[color:var(--accent)]/20 bg-white/65 ${
                isThumbnail ? "h-8 w-8" : "h-14 w-14"
              }`}
            />
            {!isThumbnail ? (
              <p className="mt-4 text-sm leading-6 text-[color:var(--muted)]">
                Add a photo to make this plant easier to recognize.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

type PlantPhotoStatusProps = {
  status: "success" | "error";
  message: string;
};

export function PlantPhotoStatus({ status, message }: PlantPhotoStatusProps) {
  return (
    <div
      className={`rounded-[1.25rem] border px-4 py-3 ${
        status === "error"
          ? "border-amber-200 bg-amber-50 text-amber-950"
          : "border-emerald-200 bg-emerald-50 text-emerald-950"
      }`}
    >
      <StatusPill tone={status === "error" ? "warning" : "success"}>
        {status === "error" ? "Photo not saved" : "Photo saved"}
      </StatusPill>
      <p className="mt-3 text-sm leading-6">{message}</p>
    </div>
  );
}
