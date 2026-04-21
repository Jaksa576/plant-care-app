import Link from "next/link";

import { SectionCard } from "@/components/section-card";
import { StatusPill } from "@/components/status-pill";
import { hasSupabaseEnv } from "@/lib/env";

const highlights = [
  {
    eyebrow: "Collection",
    title: "Track your plants without overcomplicating the model",
    description:
      "Start with a clear home for each plant, a few core attributes, and room to grow the schema as the app earns it.",
  },
  {
    eyebrow: "Care",
    title: "Build routines slice by slice",
    description:
      "Watering logs, reminders, and note-taking can be added incrementally on top of a stable route and data foundation.",
  },
  {
    eyebrow: "Setup",
    title: "Supabase is wired in, but auth is intentionally light",
    description:
      "This first slice keeps the repo ready for real auth without burying the project in placeholder abstractions.",
  },
];

export default function HomePage() {
  const supabaseConfigured = hasSupabaseEnv();

  return (
    <main className="px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow)] backdrop-blur">
          <div className="grid gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.4fr_0.8fr] lg:px-10 lg:py-12">
            <div className="max-w-3xl">
              <StatusPill tone={supabaseConfigured ? "success" : "warning"}>
                {supabaseConfigured ? "Supabase configured" : "Supabase env still needed"}
              </StatusPill>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.26em] text-[color:var(--muted)]">
                Personal plant care
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                A calm foundation for tracking plants, care routines, and notes.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
                This repository starts small on purpose: a public landing page, a future
                authenticated app area, and the minimum structure needed to build the next
                slices with confidence.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Open app placeholder
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
                >
                  View auth placeholder
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
                Current v1 focus
              </p>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-[color:var(--muted)]">
                <li>Simple App Router foundation</li>
                <li>Supabase-ready environment and helpers</li>
                <li>Docs that support slice-by-slice delivery</li>
                <li>Mobile-friendly UI without premature design system work</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <SectionCard
              key={item.title}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
