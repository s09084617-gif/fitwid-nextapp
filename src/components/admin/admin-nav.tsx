"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard/admin/coach-dashboard", label: "Dashboard", ownerOnly: false },
  { href: "/dashboard/admin/clients", label: "Clients", ownerOnly: false },
  { href: "/dashboard/admin/insights", label: "Insights", ownerOnly: false },
  { href: "/dashboard/admin/coaches", label: "Coaches", ownerOnly: true },
  { href: "/dashboard/admin/users", label: "Users", ownerOnly: true },
  { href: "/dashboard/admin/programs", label: "Programs", ownerOnly: true },
  { href: "/dashboard/admin/exercises", label: "Exercises", ownerOnly: true },
  { href: "/dashboard/admin/success-stories", label: "Success Stories", ownerOnly: true },
  { href: "/dashboard/admin/subscriptions", label: "Subscriptions", ownerOnly: true },
  { href: "/dashboard/admin/analytics", label: "Analytics", ownerOnly: true },
  { href: "/dashboard/admin/payments", label: "Payments", ownerOnly: true },
];

export function AdminNav({ isOwner = true }: { isOwner?: boolean }) {
  const pathname = usePathname();
  const tabs = TABS.filter((t) => isOwner || !t.ownerOnly);

  return (
    <nav className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
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
