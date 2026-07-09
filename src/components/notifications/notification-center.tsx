"use client";

import { useEffect, useState } from "react";
import { Dumbbell, Utensils, Droplet, BarChart3, MessageSquare, BellOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getWorkoutHistory,
  getHabitLogs,
  getMyAssignment,
  todayISO,
} from "@/lib/db/user-data";
import { buildNotifications, type AppNotification } from "@/lib/notifications";

const ICONS: Record<AppNotification["type"], typeof Dumbbell> = {
  workout: Dumbbell,
  meal: Utensils,
  water: Droplet,
  weekly_report: BarChart3,
  coach: MessageSquare,
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getWorkoutHistory(), getHabitLogs(14), getMyAssignment()]).then(
      ([workoutHistory, habits, assignment]) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoIso = weekAgo.toISOString().slice(0, 10);
        const weeklyWorkoutCount = workoutHistory.filter((w) => w.date >= weekAgoIso).length;
        const todayHabit = habits.find((h) => h.date === todayISO());

        setNotifications(
          buildNotifications({ workoutHistory, todayHabit, assignment, weeklyWorkoutCount })
        );
        setMounted(true);
      }
    );
  }, []);

  if (!mounted) {
    return <div className="h-32 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="crimson">Today&apos;s Reminders</Badge>
        <span className="text-xs text-muted">{notifications.length}</span>
      </div>
      {notifications.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted py-4">
          <BellOff size={16} /> Nothing needs your attention right now.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-md border px-3 py-2.5 ${
                  n.urgent ? "border-crimson/40 bg-crimson/5" : "border-border"
                }`}
              >
                <Icon size={16} className={n.urgent ? "text-crimson" : "text-muted"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted">{n.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-[11px] text-muted mt-4">
        These are in-app reminders only — there&apos;s no push notification
        or SMS system yet, so you&apos;ll only see these while using the app.
      </p>
    </Card>
  );
}
