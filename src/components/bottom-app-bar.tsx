"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GearIcon, HomeIcon, SproutIcon } from "@/components/icons";

const navItems = [
  { href: "/app", label: "Home", icon: HomeIcon, match: (path: string) => path === "/app" },
  {
    href: "/app/plants",
    label: "Plants",
    icon: SproutIcon,
    match: (path: string) => path.startsWith("/app/plants"),
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: GearIcon,
    match: (path: string) => path.startsWith("/app/settings"),
  },
];

export function BottomAppBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary app navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border-soft)] bg-[color:var(--surface-strong)]/95 px-5 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(23,62,63,0.08)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-[var(--tap-target)] flex-col items-center justify-center gap-1 rounded-2xl px-3 py-1.5 text-[0.72rem] font-semibold transition ${
                isActive
                  ? "text-[color:var(--accent)]"
                  : "text-[color:var(--foreground)]/70 hover:text-[color:var(--accent-ink)]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
