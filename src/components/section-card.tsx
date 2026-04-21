type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export function SectionCard({ eyebrow, title, description }: SectionCardProps) {
  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{description}</p>
    </div>
  );
}
