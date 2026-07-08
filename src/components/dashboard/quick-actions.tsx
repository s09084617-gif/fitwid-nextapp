import Link from "next/link";
import { ClipboardList, MessageCircle, Calendar, Dumbbell, Sparkles, Utensils } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const actions = [
  {
    icon: ClipboardList,
    label: "Take Assessment",
    desc: "Update your BMI, body fat & fitness score",
    href: "/assessment",
    external: false,
  },
  {
    icon: Sparkles,
    label: "Generate Workout",
    desc: "Build a workout by goal, level & equipment",
    href: "/workout-generator",
    external: false,
  },
  {
    icon: Utensils,
    label: "Plan Nutrition",
    desc: "Calculate macros & get an Indian meal plan",
    href: "/nutrition",
    external: false,
  },
  {
    icon: Calendar,
    label: "Book InBody Scan",
    desc: "Schedule your next scan at I-BLITZ",
    href: "https://wa.me/917015552731?text=Hi%2C%20I%27d%20like%20to%20book%20an%20InBody%20scan",
    external: true,
  },
  {
    icon: MessageCircle,
    label: "Message Coach",
    desc: "Direct WhatsApp line to your coach",
    href: "https://wa.me/917015552731",
    external: true,
  },
  {
    icon: Dumbbell,
    label: "View Programs",
    desc: "Browse or switch coaching programs",
    href: "/#programs",
    external: false,
  },
];

export function QuickActions() {
  return (
    <Card>
      <Badge variant="success" className="mb-4">
        Quick Actions
      </Badge>
      <div className="grid sm:grid-cols-2 gap-3">
        {actions.map((a) => {
          const content = (
            <div className="flex items-start gap-3 rounded-md border border-border p-3 hover:border-crimson/50 transition h-full">
              <div className="h-9 w-9 rounded-md bg-crimson/15 border border-crimson/30 flex items-center justify-center shrink-0">
                <a.icon size={16} className="text-crimson" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{a.label}</p>
                <p className="text-xs text-muted">{a.desc}</p>
              </div>
            </div>
          );
          return a.external ? (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <Link key={a.label} href={a.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
