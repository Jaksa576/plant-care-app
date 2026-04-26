export default function AppLoading() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="h-4 w-28 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
        <div className="mt-5 h-10 w-2/3 animate-pulse rounded-2xl bg-[color:var(--accent-soft)]" />
        <div className="mt-4 h-5 w-full animate-pulse rounded-xl bg-[color:var(--accent-soft)]" />
        <div className="mt-3 h-5 w-5/6 animate-pulse rounded-xl bg-[color:var(--accent-soft)]" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)]"
          >
            <div className="h-4 w-20 animate-pulse rounded-full bg-[color:var(--accent-soft)]" />
            <div className="mt-4 h-7 w-1/2 animate-pulse rounded-xl bg-[color:var(--accent-soft)]" />
            <div className="mt-4 h-20 animate-pulse rounded-2xl bg-[color:var(--accent-soft)]" />
          </div>
        ))}
      </section>
    </div>
  );
}
