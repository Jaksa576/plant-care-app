import Link from "next/link";
import { redirect } from "next/navigation";

import { createPlantAction } from "@/app/app/plants/actions";
import { AppShell } from "@/components/app-shell";
import { PlantForm } from "@/components/plant-form";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthState } from "@/lib/auth";

export default async function NewPlantPage() {
  const authState = await getAuthState();

  if (!authState.supabaseConfigured) {
    redirect("/login?missingEnv=1");
  }

  if (!authState.user) {
    redirect("/login");
  }

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Add a plant"
      subtitle="Create a calm, manual plant record that belongs only to your account."
      actions={<SignOutButton />}
    >
      <div className="flex flex-col gap-6">
        <Link
          href="/app"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
        >
          Back to your collection
        </Link>

        <PlantForm
          action={createPlantAction}
          submitLabel="Save plant"
          title="Start with the basics"
          description="This first plant record is intentionally simple: manual details first, with an optional photo after save and no AI identification or reminders yet."
        />
      </div>
    </AppShell>
  );
}
