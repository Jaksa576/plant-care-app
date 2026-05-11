import Link from "next/link";

import { BottomAppBar } from "@/components/bottom-app-bar";
import { PlusIcon } from "@/components/icons";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showAddPlantAction?: boolean;
};

export function AppShell({
  children,
  userEmail,
  title = "Your plant collection",
  subtitle = "A calm place for the plants that belong to this signed-in account.",
  actions,
  showAddPlantAction = true,
}: AppShellProps) {
  return (
    <div className="app-safe-bottom min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="border-b border-[color:var(--border-soft)] pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--accent-ink)]"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-strong)] ring-1 ring-[color:var(--border-soft)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/plant-care-approved-icon-square-1024.png"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                Plant Care
              </Link>
              <h1 className="mt-4 text-[1.75rem] font-semibold leading-tight sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
                {subtitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{userEmail}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {showAddPlantAction ? (
                <Link
                  href="/app/plants/new"
                  className="inline-flex min-h-[var(--tap-target)] items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add plant
                </Link>
              ) : null}
              {actions}
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>
      <BottomAppBar />
    </div>
  );
}
