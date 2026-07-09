"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/workouts", label: "Workouts" },
  { href: "/dashboard/exercises", label: "Exercises" },
  { href: "/dashboard/nutrition", label: "Nutrition" },
  { href: "/dashboard/progress", label: "Progress" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/habits", label: "Habits" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/dashboard/achievements", label: "Achievements" },
  { href: "/dashboard/coach", label: "AI Coach" },
];

export function DashboardNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const tabs = isAdmin
    ? [...TABS, { href: "/dashboard/admin", label: "Admin" }]
    : TABS;

  return (
    <nav className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
        const active =
          tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname?.startsWith(tab.href);
        const isAdminTab = tab.href === "/dashboard/admin";
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 rounded-md px-4 py-2 text-sm font-medium transition",
              active
                ? isAdminTab
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "bg-crimson/15 text-crimson border border-crimson/30"
                : "text-muted hover:text-foreground border border-transparent"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
