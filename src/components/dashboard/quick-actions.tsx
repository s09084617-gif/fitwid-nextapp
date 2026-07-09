import Link from "next/link";
import { ClipboardList, MessageCircle, Calendar, CalendarDays, Dumbbell, Sparkles, Utensils, TrendingUp, BookOpen, Bot, CheckSquare, BarChart3, Trophy, Bell, Gift, FolderOpen, CreditCard, Users, Lightbulb, Settings } from "lucide-react";
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
    href: "/dashboard/workouts",
    external: false,
  },
  {
    icon: BookOpen,
    label: "Exercise Library",
    desc: "Form cues, mistakes, alternatives & progressions",
    href: "/dashboard/exercises",
    external: false,
  },
  {
    icon: Utensils,
    label: "Plan Nutrition",
    desc: "Calculate macros & get an Indian meal plan",
    href: "/dashboard/nutrition",
    external: false,
  },
  {
    icon: TrendingUp,
    label: "Track Progress",
    desc: "Log weight, measurements & progress photos",
    href: "/dashboard/progress",
    external: false,
  },
  {
    icon: BarChart3,
    label: "View Analytics",
    desc: "Weight, body fat, muscle mass & adherence charts",
    href: "/dashboard/analytics",
    external: false,
  },
  {
    icon: CheckSquare,
    label: "Log Habits",
    desc: "Water, sleep, steps, protein & meditation",
    href: "/dashboard/habits",
    external: false,
  },
  {
    icon: CalendarDays,
    label: "Calendar",
    desc: "Rest days, upcoming sessions & PT booking",
    href: "/dashboard/calendar",
    external: false,
  },
  {
    icon: Bot,
    label: "Ask AI Coach",
    desc: "Workout, nutrition & recovery Q&A",
    href: "/dashboard/coach",
    external: false,
  },
  {
    icon: Trophy,
    label: "Achievements",
    desc: "XP, levels, badges & monthly challenge",
    href: "/dashboard/achievements",
    external: false,
  },
  {
    icon: Bell,
    label: "Notifications",
    desc: "Reminders based on your real activity",
    href: "/dashboard/notifications",
    external: false,
  },
  {
    icon: Users,
    label: "Community",
    desc: "Leaderboard & client success stories",
    href: "/dashboard/community",
    external: false,
  },
  {
    icon: Gift,
    label: "Refer a Friend",
    desc: "Share your link, track your referrals",
    href: "/dashboard/referrals",
    external: false,
  },
  {
    icon: FolderOpen,
    label: "File Manager",
    desc: "Upload InBody & blood test reports",
    href: "/dashboard/files",
    external: false,
  },
  {
    icon: Lightbulb,
    label: "AI Insights",
    desc: "Auto-detected plateaus, adherence & recovery flags",
    href: "/dashboard/insights",
    external: false,
  },
  {
    icon: Settings,
    label: "Settings",
    desc: "Add your WhatsApp number for coach messages",
    href: "/dashboard/settings",
    external: false,
  },
  {
    icon: CreditCard,
    label: "Billing",
    desc: "View plans and request a subscription",
    href: "/dashboard/billing",
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
