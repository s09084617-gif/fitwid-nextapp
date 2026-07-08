import { Clock, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkoutPlan } from "@/lib/workout-generator";

export function WorkoutPlanDisplay({
  plan,
  onSave,
  onRegenerate,
  saved,
}: {
  plan: WorkoutPlan;
  onSave?: () => void;
  onRegenerate?: () => void;
  saved?: boolean;
}) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <Badge variant="crimson" className="mb-2">
            Generated Workout
          </Badge>
          <h3 className="font-display text-2xl">{plan.title}</h3>
          <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
            <Clock size={14} /> ~{plan.estimatedMinutes} min ·{" "}
            <Dumbbell size={14} className="ml-1" /> {plan.exercises.length}{" "}
            exercises
          </p>
        </div>
        {(onSave || onRegenerate) && (
          <div className="flex gap-2 shrink-0">
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                Regenerate
              </Button>
            )}
            {onSave && (
              <Button variant="gold" size="sm" onClick={onSave} disabled={saved}>
                {saved ? "Saved ✓" : "Save Workout"}
              </Button>
            )}
          </div>
        )}
      </div>

      {plan.exercises.length === 0 ? (
        <p className="text-sm text-muted">
          No exercises match this combination of filters — try selecting more
          equipment or a different focus.
        </p>
      ) : (
        <div className="space-y-3">
          {plan.exercises.map((we, i) => (
            <div
              key={we.exercise.id}
              className="flex items-start gap-4 rounded-md border border-border p-4"
            >
              <div className="h-8 w-8 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center shrink-0 font-display text-sm text-crimson">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{we.exercise.name}</p>
                <p className="text-xs text-muted mt-0.5">{we.exercise.cue}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">
                  {we.sets} × {we.reps}
                </p>
                <p className="text-xs text-muted">{we.restSeconds}s rest</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
