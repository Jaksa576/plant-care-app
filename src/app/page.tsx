import Image from "next/image";
import Link from "next/link";

import {
  CameraIcon,
  CheckCircleIcon,
  DropletIcon,
  LeafIcon,
  RoomIcon,
  SproutIcon,
} from "@/components/icons";
import { getAuthState } from "@/lib/auth";

const loopSteps = [
  {
    title: "Add a photo",
    description: "Start with the thing you recognize first: the plant itself.",
    icon: CameraIcon,
  },
  {
    title: "Identify if helpful",
    description: "Optional suggestions can help, but you review and edit before saving.",
    icon: LeafIcon,
  },
  {
    title: "Track watering",
    description: "Today shows what needs care, with Water and Snooze close by.",
    icon: DropletIcon,
  },
  {
    title: "Move room by room",
    description: "Keep the collection organized the way plants live in your home.",
    icon: RoomIcon,
  },
];

const roomRows = [
  ["Living room", "Monstera", "overdue"],
  ["Bedroom", "Snake plant", "today"],
  ["Kitchen", "Pothos", "in 3 days"],
  ["Unassigned", "Set room later", ""],
];

function LandingHeader({ actionHref }: { actionHref: string }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Plant Care home">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-strong)] ring-1 ring-[color:var(--border-soft)]">
          <Image
            src="/brand/plant-care-approved-icon-square-1024.png"
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-cover"
            priority
          />
        </span>
        <span className="text-base font-bold text-[color:var(--accent-ink)]">Plant Care</span>
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-semibold text-[color:var(--muted)] md:flex">
        <a className="transition hover:text-[color:var(--foreground)]" href="#how-it-works">
          How it works
        </a>
        <a className="transition hover:text-[color:var(--foreground)]" href="#rooms">
          Rooms
        </a>
        <a className="transition hover:text-[color:var(--foreground)]" href="#trust">
          Trust
        </a>
        <Link className="transition hover:text-[color:var(--foreground)]" href={actionHref}>
          Sign in
        </Link>
        <Link
          className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent-ink)] px-5 py-2.5 text-white shadow-[0_12px_26px_rgba(20,90,93,0.18)] transition hover:opacity-95"
          href={actionHref}
          style={{ color: "#ffffff" }}
        >
          Start free
        </Link>
      </nav>

      <Link
        className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent-ink)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(20,90,93,0.16)] transition hover:opacity-95 md:hidden"
        href={actionHref}
        style={{ color: "#ffffff" }}
      >
        Start free
      </Link>
    </header>
  );
}

function TodayPreview() {
  const needsWater = [
    ["Monstera", "Living room - 10 days", "Overdue"],
    ["Snake plant", "Bedroom - every 14 days", "Due today"],
  ];

  return (
    <div className="relative rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 shadow-[0_24px_50px_rgba(23,62,63,0.12)] sm:p-5">
      <div className="flex items-end justify-between gap-4 border-b border-[color:var(--border-soft)] pb-4">
        <div>
          <p className="text-sm font-semibold text-[color:var(--muted)]">May 10</p>
          <h2 className="mt-1 text-3xl font-semibold leading-tight">Today</h2>
        </div>
        <span className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent-ink)] px-4 text-sm font-semibold text-white">
          + Add plant
        </span>
      </div>

      <div className="pt-5">
        <div className="mb-2 flex items-center gap-2">
          <DropletIcon className="h-5 w-5 text-[color:var(--accent-ink)]" />
          <h3 className="text-lg font-semibold">Needs water</h3>
        </div>
        <div className="divide-y divide-[color:var(--border-soft)] rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[#fffaf0] px-4">
          {needsWater.map(([plant, meta, status]) => (
            <div
              key={plant}
              className="grid grid-cols-[1fr_auto] gap-3 py-4 text-sm sm:grid-cols-[1fr_auto_auto]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-[color:var(--foreground)]">{plant}</p>
                <p className="mt-1 truncate text-[color:var(--muted)]">{meta}</p>
                <p className="mt-1 font-semibold text-[color:var(--attention)]">{status}</p>
              </div>
              <span className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--accent-ink)] px-4 font-semibold text-white">
                Water
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-5">
        <div className="mb-2 flex items-center gap-2">
          <RoomIcon className="h-5 w-5 text-[color:var(--accent-ink)]" />
          <h3 className="text-lg font-semibold">By room</h3>
        </div>
        <div className="divide-y divide-[color:var(--border-soft)] rounded-[1.25rem] border border-[color:var(--border-soft)] bg-white/80 px-4">
          <div className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="font-semibold">Living room</span>
            <span className="text-[color:var(--muted)]">2 plants</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="font-semibold">Kitchen</span>
            <span className="text-[color:var(--muted)]">calm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[610px] overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 shadow-[var(--shadow)] sm:p-6 lg:min-h-[640px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-5 top-5 h-72 rounded-[1.5rem] bg-[radial-gradient(circle_at_24%_24%,rgba(255,253,248,0.95),transparent_22%),linear-gradient(135deg,rgba(129,178,154,0.38),rgba(249,225,214,0.54))]"
      />
      <div
        aria-hidden="true"
        className="absolute right-4 top-14 h-48 w-32 rounded-full border border-white/50 bg-[color:var(--sage)]/35 blur-[1px]"
      />
      <svg
        aria-hidden="true"
        className="absolute left-7 top-12 h-56 w-44 text-[color:var(--accent-ink)]/55"
        viewBox="0 0 160 220"
        fill="none"
      >
        <path
          d="M78 212C76 168 78 114 84 54"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M83 83C35 75 22 45 31 18C70 21 91 44 83 83Z"
          fill="currentColor"
          opacity="0.28"
        />
        <path
          d="M84 124C126 112 145 83 137 49C98 55 76 82 84 124Z"
          fill="currentColor"
          opacity="0.22"
        />
        <path
          d="M79 161C44 156 24 134 21 103C60 101 82 123 79 161Z"
          fill="currentColor"
          opacity="0.2"
        />
      </svg>

      <div className="relative ml-auto max-w-[25rem] pt-20 sm:pt-24">
        <TodayPreview />
      </div>

      <div className="relative mt-4 max-w-[22rem] rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[color:var(--surface-strong)]/95 p-4 shadow-[0_14px_32px_rgba(23,62,63,0.08)]">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]">
            <CameraIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold">Photo-first setup</h3>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
              Add the plant you see first. Suggestions stay optional and editable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const authState = await getAuthState();
  const actionHref = authState.user ? "/app" : "/login";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--background)]">
      <LandingHeader actionHref={actionHref} />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-24 lg:pt-12">
        <div className="max-w-3xl">
          <h1 className="max-w-4xl text-[clamp(2.65rem,11vw,5.25rem)] font-semibold leading-[0.98] text-[color:var(--foreground)]">
            Plant care that starts with watering.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg lg:text-xl">
            Track watering, rooms, photos, and simple care notes for the plants you live
            with — without turning care into chores.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={actionHref}
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent-ink)] px-6 py-3 text-base font-bold text-white shadow-[0_16px_34px_rgba(20,90,93,0.2)] transition hover:opacity-95"
              style={{ color: "#ffffff" }}
            >
              Start your plant log
            </Link>
            <Link
              href={actionHref}
              className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-6 py-3 text-base font-bold text-[color:var(--foreground)] transition hover:bg-[color:var(--accent-soft)]"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 flex max-w-lg items-start gap-2 text-sm leading-6 text-[color:var(--muted)]">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent-ink)]" />
            Helpful suggestions stay reviewable. You decide what gets saved.
          </p>
        </div>

        <HeroVisual />
      </section>

      <section
        id="how-it-works"
        className="border-y border-[color:var(--border-soft)] bg-[color:var(--surface-strong)]/72"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              A calmer loop for everyday plant care
            </h2>
            <p className="mt-4 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              Start with a photo, keep watering simple, and organize plants around the
              rooms where they live.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {loopSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="border-t border-[color:var(--border)] pt-5 md:min-h-64"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-[color:var(--muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-6 w-6 text-[color:var(--accent-ink)]" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rooms" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div>
          <RoomIcon className="h-9 w-9 text-[color:var(--accent-ink)]" />
          <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Care by room, not by clutter.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            See what needs water, then move through the rooms where your plants actually
            live.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4 shadow-[var(--shadow)] sm:p-6">
          <div className="divide-y divide-[color:var(--border-soft)]">
            {roomRows.map(([room, plant, status]) => (
              <div key={room} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold">{room}</p>
                  <p className="mt-1 truncate text-sm text-[color:var(--muted)]">{plant}</p>
                </div>
                {status ? (
                  <span className="shrink-0 rounded-full bg-[color:var(--stone)] px-3 py-1 text-sm font-semibold text-[color:var(--accent-ink)]">
                    {status}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="trust"
        className="border-y border-[color:var(--border-soft)] bg-[linear-gradient(135deg,rgba(223,238,229,0.72),rgba(255,253,248,0.84))]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <SproutIcon className="h-9 w-9 text-[color:var(--accent-ink)]" />
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              You stay in control of every plant record.
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="border-t border-[color:var(--border)] pt-5">
              <h3 className="text-2xl font-semibold">Your records stay yours.</h3>
              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
                Photos, notes, rooms, reminders, and suggestions stay tied to your own
                plant collection.
              </p>
            </div>
            <div className="border-t border-[color:var(--border)] pt-5">
              <h3 className="text-2xl font-semibold">AI stays reviewable.</h3>
              <p className="mt-4 text-base leading-8 text-[color:var(--muted)]">
                Identification can help, but you decide what gets saved.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-7 shadow-[var(--shadow)] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Ready to start your plant log?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[color:var(--muted)]">
              Keep watering visible, rooms simple, and plant records editable from the
              first day.
            </p>
          </div>
          <Link
            href={actionHref}
            className="inline-flex min-h-[var(--tap-target)] items-center justify-center rounded-full bg-[color:var(--accent-ink)] px-7 py-3 text-base font-bold text-white shadow-[0_16px_34px_rgba(20,90,93,0.2)] transition hover:opacity-95"
            style={{ color: "#ffffff" }}
          >
            Start free
          </Link>
        </div>
      </section>
    </main>
  );
}
