"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getWeightLog,
  getSavedWorkouts,
  getSavedMealPlans,
  getWorkoutHistory,
  getProgressPhotos,
  getMeasurements,
  getLastAssessment,
} from "@/lib/local-store";

export function LocalUsageStats() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
    setStats({
      weightEntries: getWeightLog().length,
      savedWorkouts: getSavedWorkouts().length,
      savedMealPlans: getSavedMealPlans().length,
      workoutsLogged: getWorkoutHistory().length,
      progressPhotos: getProgressPhotos().length,
      measurements: getMeasurements().length,
      hasAssessment: getLastAssessment() ? 1 : 0,
    });
  }, []);

  if (!stats) {
    return <div className="h-32 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const items = [
    { label: "Weight Entries", value: stats.weightEntries },
    { label: "Saved Workouts", value: stats.savedWorkouts },
    { label: "Saved Meal Plans", value: stats.savedMealPlans },
    { label: "Workouts Logged", value: stats.workoutsLogged },
    { label: "Progress Photos", value: stats.progressPhotos },
    { label: "Measurements Logged", value: stats.measurements },
  ];

  return (
    <Card>
      <Badge variant="gold" className="mb-4">
        This Browser&apos;s Usage
      </Badge>
      <p className="text-xs text-muted mb-4">
        Since there&apos;s no analytics backend yet, this only reflects
        activity in the current browser — not real cross-user analytics.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label}>
            <CardTitle className="text-gold">{item.value}</CardTitle>
            <CardDescription>{item.label}</CardDescription>
          </div>
        ))}
      </div>
    </Card>
  );
}
