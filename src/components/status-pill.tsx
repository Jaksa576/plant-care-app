type StatusPillProps = {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning";
};

const toneClasses: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  default: "bg-white/80 text-[color:var(--foreground)]",
  success: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
};

export function StatusPill({
  children,
  tone = "default",
}: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
