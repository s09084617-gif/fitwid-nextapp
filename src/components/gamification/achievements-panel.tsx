"use client";

import { useEffect, useState } from "react";
import { Award, Flame, Zap } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getWorkoutHistory,
  getWeightLog,
  getAssessmentHistory,
  getPersonalRecords,
  getHabitLogs,
} from "@/lib/db/user-data";
import { calculateStreak } from "@/lib/streaks";
import { calculateXP, calculateLevel, calculateBadges, type UserStats } from "@/lib/gamification";
import { getMonthlyChallenge } from "@/lib/monthly-challenge";
import { cn } from "@/lib/utils";

export function AchievementsPanel() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [monthlyProgress, setMonthlyProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([
      getWorkoutHistory(),
      getWeightLog(),
      getAssessmentHistory(),
      getPersonalRecords(),
      getHabitLogs(90),
    ]).then(([workouts, weights, assessments, prs, habits]) => {
      const streak = calculateStreak(workouts.map((w) => w.date));
      setStats({
        workoutsLogged: workouts.length,
        weightEntries: weights.length,
        assessmentsTaken: assessments.length,
        prsLogged: prs.length,
        habitDaysLogged: habits.length,
        currentStreak: streak.current,
      });

      const challenge = getMonthlyChallenge();
      const thisMonth = new Date().getMonth();
      const inThisMonth = (dateStr: string) => new Date(dateStr).getMonth() === thisMonth;
      let progress = 0;
      if (challenge.metric === "workouts") progress = workouts.filter((w) => inThisMonth(w.date)).length;
      if (challenge.metric === "habitDays") progress = habits.filter((h) => inThisMonth(h.date)).length;
      if (challenge.metric === "weightEntries") progress = weights.filter((w) => inThisMonth(w.date)).length;
      setMonthlyProgress(progress);

      setMounted(true);
    });
  }, []);

  if (!mounted || !stats) {
    return <div className="h-64 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const xp = calculateXP(stats);
  const { level, title, xpIntoLevel, xpForNextLevel } = calculateLevel(xp);
  const badges = calculateBadges(stats);
  const earnedBadges = badges.filter((b) => b.earned);
  const challenge = getMonthlyChallenge();
  const progressPct = Math.min(100, Math.round((monthlyProgress / challenge.target) * 100));

  return (
    <div className="space-y-6">
      <Card glass>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center shrink-0">
            <Zap size={24} className="text-gold" />
          </div>
          <div>
            <p className="font-display text-2xl">
              Level {level} — {title}
            </p>
            <p className="text-xs text-muted">{xp} total XP</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden mb-1.5">
          <div
            className="h-full bg-gradient-to-r from-crimson to-gold rounded-full transition-all"
            style={{ width: `${(xpIntoLevel / xpForNextLevel) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted">
          {xpIntoLevel} / {xpForNextLevel} XP to Level {level + 1}
        </p>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="crimson">This Month&apos;s Challenge</Badge>
          <span className="text-xs text-muted">
            {monthlyProgress}/{challenge.target} {challenge.unit}
          </span>
        </div>
        <CardTitle>{challenge.title}</CardTitle>
        <CardDescription className="mb-3">{challenge.description}</CardDescription>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progressPct >= 100 ? "bg-success" : "bg-crimson"
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {progressPct >= 100 && (
          <p className="text-xs text-success mt-2">Challenge complete! 🎉</p>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Flame size={16} className="text-crimson" />
          <Badge variant="gold">
            {earnedBadges.length}/{badges.length} Badges Earned
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={cn(
                "rounded-md border p-3 text-center",
                b.earned ? "border-gold/40 bg-gold/5" : "border-border opacity-40"
              )}
            >
              <Award size={20} className={cn("mx-auto mb-1.5", b.earned ? "text-gold" : "text-muted")} />
              <p className="text-xs font-medium">{b.name}</p>
              <p className="text-[10px] text-muted mt-0.5">{b.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
