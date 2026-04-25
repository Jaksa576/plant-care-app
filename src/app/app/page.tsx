import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { SignOutButton } from "@/components/sign-out-button";
import { getAuthState } from "@/lib/auth";
import { redirect } from "next/navigation";

const nextSlices = [
  {
    eyebrow: "Next",
    title: "Plant collection comes next",
    description:
      "The next slice can introduce the first user-owned plant records without mixing setup into this auth pass.",
  },
  {
    eyebrow: "Soon",
    title: "Watering workflows follow the collection model",
    description:
      "Once plants exist, the app can add due dates, completion actions, and a simple dashboard with much less guesswork.",
  },
  {
    eyebrow: "Later",
    title: "Photos, reminders, and assistive AI stay deferred",
    description:
      "Those features can layer in after the signed-in shell and core records feel reliable and easy to use.",
  },
];

export default async function AppPage() {
  const authState = await getAuthState();

  if (!authState.supabaseConfigured) {
    redirect("/login?missingEnv=1");
  }

  if (!authState.user) {
    redirect("/login");
  }

  return (
    <AppShell userEmail={authState.user.email ?? "Signed-in user"} actions={<SignOutButton />}>
      <div className="flex flex-col gap-6">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Signed-in space
            </p>
            <h2 className="mt-4 text-3xl font-semibold">Welcome inside the app.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
              Your account is working and this protected shell is ready for the first real
              product data. The next slices can add plants, watering setup, and reminders on
              top of this foundation.
            </p>

            <div className="mt-6 rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Empty state
              </p>
              <h3 className="mt-3 text-xl font-semibold">No plant setup yet, by design.</h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                This slice stops at account access. Plant collection and watering setup come
                next, so nothing here asks you to name a plant or enter care guidance yet.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              This slice includes
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
              <li>Email sign-in and sign-up with Supabase Auth.</li>
              <li>Route protection for the app area and redirect back to sign-in after sign-out.</li>
              <li>A minimal app shell that sets up the next product steps without starting them.</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {nextSlices.map((item) => (
            <SectionCard
              key={item.title}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
