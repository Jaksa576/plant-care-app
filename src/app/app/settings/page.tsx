import { AppShell } from "@/components/app-shell";
import { BellIcon, CalendarIcon, GearIcon, SproutIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthState } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const authState = await getAuthState();

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

  return (
    <AppShell
      userEmail={authState.user.email ?? "Signed-in user"}
      title="Settings"
      subtitle="Account and app-level controls stay secondary to the daily watering flow."
      actions={<SignOutButton />}
    >
      <div className="grid gap-4">
        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <GearIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Signed in as {authState.user.email ?? "this account"}.
              </p>
              <div className="mt-4">
                <SignOutButton />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <SproutIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Setup</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Review the short onboarding path any time. It stays optional and never blocks
                the watering dashboard.
              </p>
              <Link
                href="/app/onboarding?review=1"
                className="mt-4 inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
              >
                Review setup
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <BellIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Reminders</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Watering reminders remain app-owned and are managed from each plant.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)] p-5">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-[color:var(--accent)]">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Google Calendar</h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                Calendar events mirror Plant Care reminders. Plant Care stays the source of truth.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
