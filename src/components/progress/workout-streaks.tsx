"use client";

import { useEffect, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWorkoutHistory } from "@/lib/db/user-data";
import { calculateStreak } from "@/lib/streaks";

export function WorkoutStreaks() {
  const [streak, setStreak] = useState<{ current: number; longest: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getWorkoutHistory().then((history) => {
      const dates = history.map((h) => h.date);
      setStreak(calculateStreak(dates));
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return <div className="h-28 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card>
      <Badge variant="crimson" className="mb-4">
        Workout Streaks
      </Badge>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center shrink-0">
            <Flame size={20} className="text-crimson" />
          </div>
          <div>
            <p className="font-display text-2xl">{streak?.current ?? 0}</p>
            <p className="text-xs text-muted">Current Streak (days)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
            <Trophy size={20} className="text-gold" />
          </div>
          <div>
            <p className="font-display text-2xl">{streak?.longest ?? 0}</p>
            <p className="text-xs text-muted">Longest Streak (days)</p>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted mt-4">
        Based on days you logged a workout in Workout History. Log today&apos;s
        session to keep your streak alive.
      </p>
    </Card>
  );
}
