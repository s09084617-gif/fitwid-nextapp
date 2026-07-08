"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWeightLog, getWorkoutHistory, getAssessmentHistory } from "@/lib/db/user-data";

interface WeeklyStats {
  workoutsThisWeek: number;
  weightChange: number | null;
  latestBodyFat: number | null;
  bodyFatChange: number | null;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function WeeklyReport() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getWeightLog(), getWorkoutHistory(), getAssessmentHistory()]).then(
      ([weightLog, workoutHistory, assessments]) => {
        const weekAgo = daysAgo(7);

        const workoutsThisWeek = workoutHistory.filter((w) => w.date >= weekAgo).length;

        const weekEntries = weightLog.filter((w) => w.date >= weekAgo);
        const weightChange =
          weekEntries.length >= 2
            ? Math.round(
                (weekEntries[weekEntries.length - 1].weightKg - weekEntries[0].weightKg) * 10
              ) / 10
            : null;

        const latestBodyFat =
          assessments.length > 0 ? assessments[assessments.length - 1].result.bodyFatPercent : null;
        const bodyFatChange =
          assessments.length >= 2
            ? Math.round(
                (assessments[assessments.length - 1].result.bodyFatPercent -
                  assessments[assessments.length - 2].result.bodyFatPercent) *
                  10
              ) / 10
            : null;

        setStats({ workoutsThisWeek, weightChange, latestBodyFat, bodyFatChange });
        setMounted(true);
      }
    );
  }, []);

  if (!mounted) {
    return <div className="h-32 rounded-lg bg-surface-2 animate-pulse" />;
  }

  return (
    <Card glass>
      <Badge variant="success" className="mb-4">
        This Week&apos;s Report
      </Badge>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div>
          <CardTitle className="text-gold">{stats?.workoutsThisWeek ?? 0}</CardTitle>
          <CardDescription>Workouts Logged</CardDescription>
        </div>
        <div>
          <CardTitle>
            {stats?.weightChange !== null
              ? `${stats!.weightChange! > 0 ? "+" : ""}${stats!.weightChange}kg`
              : "—"}
          </CardTitle>
          <CardDescription>Weight Change (7d)</CardDescription>
        </div>
        <div>
          <CardTitle>
            {stats?.latestBodyFat !== null ? `${stats!.latestBodyFat}%` : "—"}
            {stats?.bodyFatChange !== null && (
              <span
                className={`text-sm ml-1 ${
                  stats!.bodyFatChange! < 0 ? "text-success" : "text-warning"
                }`}
              >
                ({stats!.bodyFatChange! > 0 ? "+" : ""}
                {stats!.bodyFatChange}%)
              </span>
            )}
          </CardTitle>
          <CardDescription>Body Fat (latest)</CardDescription>
        </div>
      </div>
    </Card>
  );
}
