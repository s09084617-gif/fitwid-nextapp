"use client";

import { Clock, Dumbbell, Printer, Star, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseDetailCard } from "@/components/workout/exercise-detail-card";
import type { WorkoutPlan } from "@/lib/workout-generator";

export function WorkoutPlanDisplay({
  plan,
  onSave,
  onRegenerate,
  onToggleFavorite,
  saved,
}: {
  plan: WorkoutPlan;
  onSave?: () => void;
  onRegenerate?: () => void;
  onToggleFavorite?: () => void;
  saved?: boolean;
}) {
  function handlePrint() {
    window.print();
  }

  return (
    <Card className="print:border-none print:shadow-none print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 print:mb-4">
        <div>
          <Badge variant="crimson" className="mb-2 print:hidden">
            Generated Workout
          </Badge>
          <h3 className="font-display text-2xl">{plan.title}</h3>
          <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
            <Clock size={14} /> ~{plan.estimatedMinutes} min ·{" "}
            <Dumbbell size={14} className="ml-1" /> {plan.exercises.length}{" "}
            exercises
          </p>
        </div>
        <div className="flex gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            title="Print or save as PDF"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground hover:border-crimson/50 transition flex items-center gap-1.5"
          >
            <Printer size={14} /> Print / PDF
          </button>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              title={plan.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-muted hover:text-gold hover:border-gold/50 transition"
            >
              <Star size={14} className={plan.isFavorite ? "fill-gold text-gold" : ""} />
            </button>
          )}
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
      </div>

      {plan.injuryNote && (
        <div className="flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/5 px-3 py-2.5 mb-4 print:hidden">
          <AlertTriangle size={14} className="text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/90">{plan.injuryNote}</p>
        </div>
      )}

      {plan.exercises.length === 0 ? (
        <p className="text-sm text-muted">
          No exercises match this combination of filters — try selecting more
          equipment or a different focus.
        </p>
      ) : (
        <div className="space-y-3">
          {plan.exercises.map((we, i) => (
            <ExerciseDetailCard key={we.exercise.id} we={we} index={i} />
          ))}
        </div>
      )}
    </Card>
  );
}
