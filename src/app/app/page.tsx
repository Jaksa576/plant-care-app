import { AppShell } from "@/components/app-shell";
import { AuthPlaceholderNotice } from "@/components/auth-placeholder-notice";
import { SectionCard } from "@/components/section-card";
import { getAppAccessState } from "@/lib/auth";

const nextSlices = [
  {
    eyebrow: "Next",
    title: "Auth and account onboarding",
    description:
      "Turn the placeholder route into a genuinely protected area backed by Supabase Auth and a minimal first-user flow.",
  },
  {
    eyebrow: "Soon",
    title: "Plant collection model",
    description:
      "Add the first persisted plant records with a small schema: name, nickname, room, and a few care-related fields.",
  },
  {
    eyebrow: "Later",
    title: "Care logs and reminders",
    description:
      "Layer in watering history and reminder logic after the core collection flow is reliable and easy to follow.",
  },
];

export default async function AppPage() {
  const accessState = await getAppAccessState();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <AuthPlaceholderNotice
          supabaseConfigured={accessState.supabaseConfigured}
          userEmail={accessState.userEmail}
        />

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-6 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Current behavior
            </p>
            <h2 className="mt-4 text-2xl font-semibold">What this route does today</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
              <li>Reads the current server-side session if Supabase environment variables are present.</li>
              <li>Shows whether the project is configured for Supabase and whether a user session exists.</li>
              <li>Stays intentionally usable without a completed auth flow so the repo remains easy to boot up.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Guardrail
            </p>
            <h2 className="mt-4 text-2xl font-semibold">What this route does not do yet</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[color:var(--muted)]">
              <li>It does not block anonymous visitors with middleware or redirects.</li>
              <li>It does not implement sign-in, sign-up, password reset, or profile setup.</li>
              <li>It does not fetch plant data, reminders, AI services, or calendar integrations.</li>
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
