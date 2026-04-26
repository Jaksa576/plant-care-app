import Link from "next/link";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

const navItems = [
  { href: "/app", label: "Collection" },
  { href: "/", label: "Home" },
];

export function AppShell({
  children,
  userEmail,
  title = "Your plant collection",
  subtitle = "A calm place for the plants that belong to this signed-in account.",
  actions,
}: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-5 py-4 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
                Plant Care App
              </p>
              <h1 className="mt-1 text-xl font-semibold">{title}</h1>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{subtitle}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{userEmail}</p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <nav className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {actions}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
