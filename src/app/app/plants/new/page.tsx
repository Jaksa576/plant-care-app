import Link from "next/link";
import { redirect } from "next/navigation";

import { createPlantAction } from "@/app/app/plants/actions";
import { AppShell } from "@/components/app-shell";
import { PlantForm } from "@/components/plant-form";
import { SignOutButton } from "@/components/sign-out-button";
import { CameraIcon, LeafIcon } from "@/components/icons";
import { getAuthState } from "@/lib/auth";
import { listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type NewPlantPageProps = {
  searchParams: Promise<{
    start?: string;
  }>;
};

export default async function NewPlantPage({ searchParams }: NewPlantPageProps) {
  const [authState, params] = await Promise.all([getAuthState(), searchParams]);

  if (!authState.supabaseConfigured) {
    redirect("/login?missingEnv=1");
  }

  if (!authState.user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?missingEnv=1");
  }

  const roomsResult = await listPlantRoomsForUser(supabase, authState.user.id);
  const startsWithPhoto = params.start === "photo";

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Add a plant"
      subtitle="Create a calm, manual plant record that belongs only to your account."
      actions={<SignOutButton />}
    >
      <div className="flex flex-col gap-6">
        <Link
          href="/app/plants"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          Back to Plants
        </Link>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/app/plants/new"
              className={`flex min-h-[var(--tap-target)] items-center gap-3 rounded-[1.25rem] border px-4 py-3 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)] ${
                startsWithPhoto
                  ? "border-[color:var(--border)] bg-white/70 text-[color:var(--foreground)]"
                  : "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
              }`}
            >
              <LeafIcon className="h-5 w-5 shrink-0 text-[color:var(--accent)]" />
              Add manually
            </Link>
            <Link
              href="/app/plants/new?start=photo"
              className={`flex min-h-[var(--tap-target)] items-center gap-3 rounded-[1.25rem] border px-4 py-3 text-sm font-semibold transition hover:bg-[color:var(--accent-soft)] ${
                startsWithPhoto
                  ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--foreground)]"
                  : "border-[color:var(--border)] bg-white/70 text-[color:var(--foreground)]"
              }`}
            >
              <CameraIcon className="h-5 w-5 shrink-0 text-[color:var(--accent)]" />
              Start with a photo
            </Link>
          </div>
        </section>

        <PlantForm
          action={createPlantAction}
          submitLabel="Save plant"
          title={startsWithPhoto ? "Start with a photo" : "Start with the basics"}
          description={
            startsWithPhoto
              ? "Add a photo first if it helps, then finish the editable plant details before saving."
              : "Create a calm, manual plant record. Photo, AI identification, and reminders all stay optional."
          }
          rooms={roomsResult.data ?? []}
          allowInitialPhoto
          startsWithPhoto={startsWithPhoto}
        />
      </div>
    </AppShell>
  );
}
