"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard/admin/coach-dashboard", label: "Dashboard" },
  { href: "/dashboard/admin/clients", label: "Clients" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/programs", label: "Programs" },
  { href: "/dashboard/admin/exercises", label: "Exercises" },
  { href: "/dashboard/admin/success-stories", label: "Success Stories" },
  { href: "/dashboard/admin/subscriptions", label: "Subscriptions" },
  { href: "/dashboard/admin/analytics", label: "Analytics" },
  { href: "/dashboard/admin/payments", label: "Payments" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1.5">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "shrink-0 rounded-md px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-gold/15 text-gold border border-gold/30"
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
