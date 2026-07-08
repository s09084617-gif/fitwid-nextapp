"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/workouts", label: "Workouts" },
  { href: "/dashboard/nutrition", label: "Nutrition" },
  { href: "/dashboard/progress", label: "Progress" },
];

export function DashboardNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const tabs = isAdmin
    ? [...TABS, { href: "/dashboard/admin", label: "Admin" }]
    : TABS;

  return (
    <nav className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-1">
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
