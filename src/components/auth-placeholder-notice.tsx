import { StatusPill } from "@/components/status-pill";

type AuthPlaceholderNoticeProps = {
  supabaseConfigured: boolean;
  userEmail?: string;
};

export function AuthPlaceholderNotice({
  supabaseConfigured,
  userEmail,
}: AuthPlaceholderNoticeProps) {
  const tone = supabaseConfigured ? "success" : "warning";
  const label = supabaseConfigured ? "Supabase configured" : "Env setup needed";

  return (
    <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <StatusPill tone={tone}>{label}</StatusPill>
          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            This area is reserved for the future signed-in experience.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
            The route exists now so we can build the app slice by slice. Full sign-in,
            route protection, and user-specific data will land in a later task.
          </p>
        </div>

        <div className="rounded-3xl border border-[color:var(--border)] bg-white/80 px-4 py-3 text-sm text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--foreground)]">Session status</p>
          <p className="mt-1">{userEmail ? `Signed in as ${userEmail}` : "No active session found."}</p>
        </div>
      </div>
    </section>
  );
}
