import Link from "next/link";
import { redirect } from "next/navigation";

import {
  createPlantAction,
  identifyInitialPlantPhotoAction,
  previewCareProfileForPlantNamesAction,
} from "@/app/app/plants/actions";
import { AppShell } from "@/components/app-shell";
import { PlantForm } from "@/components/plant-form";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthState } from "@/lib/auth";
import { listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type NewPlantPageProps = {
  searchParams: Promise<{
    start?: string;
  }>;
};

export default async function NewPlantPage({ searchParams }: NewPlantPageProps) {
  const [authState] = await Promise.all([getAuthState(), searchParams]);

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

        <PlantForm
          action={createPlantAction}
          submitLabel="Save plant"
          title="Add a plant"
          description="Add a plant in a few short steps. You can skip identification and save a manual plant record."
          rooms={roomsResult.data ?? []}
          allowInitialPhoto
          startsWithPhoto
          identifyInitialPhotoAction={identifyInitialPlantPhotoAction}
          previewCareProfileAction={previewCareProfileForPlantNamesAction}
        />
      </div>
    </AppShell>
  );
}
