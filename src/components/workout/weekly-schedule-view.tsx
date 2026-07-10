"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutPlanDisplay } from "@/components/workout/workout-plan-display";
import type { WeeklySchedule } from "@/lib/workout-generator";
import { cn } from "@/lib/utils";

const FOCUS_LABELS: Record<string, string> = {
  full_body: "Full Body",
  upper_body: "Upper Body",
  lower_body: "Lower Body",
  push: "Push",
  pull: "Pull",
  legs: "Legs",
  core: "Core",
  cardio: "Cardio",
};

export function WeeklyScheduleView({
  schedule,
  onSaveDay,
  savedDayIds,
}: {
  schedule: WeeklySchedule;
  onSaveDay?: (dayIndex: number) => void;
  savedDayIds?: Set<number>;
}) {
  const [activeDay, setActiveDay] = useState(0);
  const activePlan = schedule.days[activeDay];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-crimson" />
          <Badge variant="crimson">Recommended Split</Badge>
        </div>
        <p className="font-display text-xl mb-4">{schedule.splitLabel}</p>
        <div className="flex flex-wrap gap-2">
          {schedule.days.map((day, i) => (
            <button
              key={day.dayIndex}
              onClick={() => setActiveDay(i)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition text-left min-w-[88px]",
                activeDay === i
                  ? "border-crimson bg-crimson/15 text-crimson"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              <p>{day.dayLabel}</p>
              <p className="text-[11px] opacity-80">{FOCUS_LABELS[day.focus] ?? day.focus}</p>
            </button>
          ))}
        </div>
      </Card>

      {activePlan && (
        <WorkoutPlanDisplay
          plan={activePlan.plan}
          onSave={onSaveDay ? () => onSaveDay(activeDay) : undefined}
          saved={savedDayIds?.has(activeDay)}
        />
      )}
    </div>
  );
}
