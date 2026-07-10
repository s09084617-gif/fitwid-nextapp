"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getWorkoutHistory,
  getMyProfileSnapshot,
  getSavedWorkouts,
  todayISO,
  type WorkoutHistoryEntry,
} from "@/lib/db/user-data";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WorkoutSummary() {
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [targetDays, setTargetDays] = useState(4);
  const [suggestedTitle, setSuggestedTitle] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getWorkoutHistory(), getMyProfileSnapshot(), getSavedWorkouts()]).then(
      ([h, profile, saved]) => {
        setHistory(h);
        if (profile?.workoutDaysPerWeek) setTargetDays(profile.workoutDaysPerWeek);
        const today = todayISO();
        const doneToday = h.some((entry) => entry.date === today);
        if (!doneToday && saved.length > 0) setSuggestedTitle(saved[0].title);
        setMounted(true);
      }
    );
  }, []);

  if (!mounted) {
    return <div className="h-64 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const weekStart = startOfWeek(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const historyByDate = new Map(history.map((h) => [h.date, h]));
  const today = todayISO();
  const completedThisWeek = weekDates.filter(
    (d) => historyByDate.has(d.toISOString().slice(0, 10))
  ).length;
  const todayEntry = historyByDate.get(today);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">This Week&apos;s Workouts</Badge>
        <span className="text-xs text-muted">
          {completedThisWeek}/{targetDays} sessions done
        </span>
      </div>

      <div className="rounded-md border border-border p-3 mb-4">
        <p className="text-xs text-muted mb-1">Today</p>
        {todayEntry ? (
          <p className="text-sm font-medium text-success">✓ {todayEntry.title}</p>
        ) : suggestedTitle ? (
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{suggestedTitle}</p>
            <Link href="/dashboard/workouts" className="text-xs text-crimson flex items-center gap-1">
              Go log it <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <Link href="/dashboard/workouts" className="text-sm text-crimson flex items-center gap-1">
            Generate today&apos;s workout <ArrowRight size={12} />
          </Link>
        )}
      </div>

      <ul className="space-y-2.5">
        {weekDates.map((d) => {
          const dateStr = d.toISOString().slice(0, 10);
          const entry = historyByDate.get(dateStr);
          const isToday = dateStr === today;
          return (
            <li key={dateStr} className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                  entry ? "bg-success/15 text-success" : "bg-surface-2 text-muted"
                } ${isToday ? "ring-1 ring-crimson" : ""}`}
              >
                <Dumbbell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {entry ? entry.title : "—"}
                </p>
                <p className="text-xs text-muted">{DAY_LABELS[d.getDay()]}</p>
              </div>
              {entry?.durationMinutes && (
                <span className="text-xs text-muted shrink-0">{entry.durationMinutes} min</span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
