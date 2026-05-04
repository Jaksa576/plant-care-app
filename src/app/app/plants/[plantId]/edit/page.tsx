import Link from "next/link";
import { redirect } from "next/navigation";

import { archivePlantAction, updatePlantAction } from "@/app/app/plants/actions";
import { AppShell } from "@/components/app-shell";
import { ArchivePlantForm } from "@/components/archive-plant-form";
import { PlantForm } from "@/components/plant-form";
import { SignOutButton } from "@/components/sign-out-button";
import { StatusPill } from "@/components/status-pill";
import { getAuthState } from "@/lib/auth";
import { getPlantForUser } from "@/lib/plants/data";
import { getPlantPrimaryLabel } from "@/lib/plants/presenters";
import { toPlantFormValues } from "@/lib/plants/forms";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type EditPlantPageProps = {
  params: Promise<{
    plantId: string;
  }>;
  searchParams: Promise<{
    created?: string;
    updated?: string;
    archiveError?: string;
  }>;
};

export default async function EditPlantPage({ params, searchParams }: EditPlantPageProps) {
  const [{ plantId }, { created, updated, archiveError }, authState] = await Promise.all([
    params,
    searchParams,
    getAuthState(),
  ]);

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

  const result = await getPlantForUser(supabase, authState.user.id, plantId);
  const plant = result.data;

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title={plant ? `Edit ${getPlantPrimaryLabel(plant)}` : "Plant not available"}
      subtitle="Update this manual plant record without changing the slice scope."
      actions={<SignOutButton />}
    >
      <div className="flex flex-col gap-6">
        <Link
          href={plant ? `/app/plants/${plantId}` : "/app"}
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          {plant ? "Back to plant profile" : "Back to your collection"}
        </Link>

        {created === "1" ? (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <StatusPill tone="success">Plant saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">
              Your manual plant record is saved and now belongs to this signed-in account.
            </p>
          </div>
        ) : null}

        {updated === "1" ? (
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
            <StatusPill tone="success">Changes saved</StatusPill>
            <p className="mt-3 text-sm leading-7 text-emerald-950/80">
              This plant record has been updated. Watering guidance here is still fully editable.
            </p>
          </div>
        ) : null}

        {result.error ? (
          <section className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill tone="warning">Plant unavailable</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">We couldn&apos;t open that plant</h2>
            <p className="mt-3 text-sm leading-7 text-amber-950/80 sm:text-base">
              {result.error}
            </p>
          </section>
        ) : null}

        {!result.error && !plant ? (
          <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-6 shadow-[var(--shadow)] sm:p-8">
            <StatusPill>Not found here</StatusPill>
            <h2 className="mt-5 text-2xl font-semibold">This plant isn&apos;t available in your collection</h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              It may have been archived already, or it may belong to a different signed-in account.
            </p>
          </section>
        ) : null}

        {plant ? (
          <>
            <PlantForm
              action={updatePlantAction.bind(null, plantId)}
              submitLabel="Save changes"
              title="Keep this record beginner-friendly"
              description="You can update names, location, notes, and user-editable watering guidance here without turning this slice into watering workflow logic."
              initialValues={toPlantFormValues(plant)}
            />

            <ArchivePlantForm
              action={archivePlantAction.bind(null, plantId)}
              showError={archiveError === "1"}
            />
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
