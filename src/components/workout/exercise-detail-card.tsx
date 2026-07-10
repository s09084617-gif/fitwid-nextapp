"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle, Repeat2, Dumbbell as DumbbellIcon, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { WorkoutExercise } from "@/lib/workout-generator";
import { cn } from "@/lib/utils";

const DIFFICULTY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

const EQUIPMENT_LABELS: Record<string, string> = {
  bodyweight: "Bodyweight",
  dumbbell: "Dumbbells",
  barbell: "Barbell",
  machine: "Machine",
  bands: "Resistance Bands",
  kettlebell: "Kettlebell",
};

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  core: "Core / Abs",
  cardio: "Cardio",
};

export function ExerciseDetailCard({ we, index }: { we: WorkoutExercise; index: number }) {
  const [open, setOpen] = useState(false);
  const { exercise } = we;

  return (
    <div className="rounded-lg border border-border overflow-hidden print:break-inside-avoid">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-4 p-4 text-left"
      >
        <div className="h-8 w-8 rounded-full bg-crimson/15 border border-crimson/30 flex items-center justify-center shrink-0 font-display text-sm text-crimson">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{exercise.name}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <Badge variant="neutral">{MUSCLE_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup}</Badge>
            <Badge variant="neutral">{EQUIPMENT_LABELS[exercise.equipment] ?? exercise.equipment}</Badge>
            <Badge variant={DIFFICULTY_VARIANT[exercise.difficulty] ?? "neutral"}>
              {exercise.difficulty}
            </Badge>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-medium">
            {we.sets} × {we.reps}
          </p>
          <p className="text-xs text-muted">{we.restSeconds}s rest</p>
        </div>
        <ChevronDown
          size={16}
          className={cn("text-muted shrink-0 mt-1 transition-transform print:hidden", open && "rotate-180")}
        />
      </button>

      <div className={cn("px-4 pb-4 space-y-3", !open && "hidden print:block")}>
        <div className="grid grid-cols-3 gap-3 text-center bg-surface-2 rounded-md p-3">
          <div>
            <p className="text-xs text-muted flex items-center justify-center gap-1"><Repeat2 size={11} /> Tempo</p>
            <p className="text-sm font-semibold mt-0.5">{we.tempo}</p>
          </div>
          <div>
            <p className="text-xs text-muted flex items-center justify-center gap-1"><Gauge size={11} /> Rest</p>
            <p className="text-sm font-semibold mt-0.5">{we.restSeconds}s</p>
          </div>
          <div>
            <p className="text-xs text-muted flex items-center justify-center gap-1"><DumbbellIcon size={11} /> Volume</p>
            <p className="text-sm font-semibold mt-0.5">{we.sets} × {we.reps}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-1.5">Instructions</p>
          <ul className="space-y-1">
            {exercise.cues.map((cue, i) => (
              <li key={i} className="text-xs text-foreground/85 flex gap-2">
                <span className="text-crimson shrink-0">{i + 1}.</span> {cue}
              </li>
            ))}
          </ul>
        </div>

        {exercise.commonMistakes.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-warning mb-1.5 flex items-center gap-1.5">
              <AlertTriangle size={12} /> Common Mistakes
            </p>
            <ul className="space-y-1">
              {exercise.commonMistakes.map((m, i) => (
                <li key={i} className="text-xs text-muted flex gap-2">
                  <span className="shrink-0">•</span> {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        {we.alternativeExercises.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
              Alternatives
            </p>
            <div className="flex flex-wrap gap-1.5">
              {we.alternativeExercises.map((alt) => (
                <Badge key={alt.id} variant="neutral">{alt.name}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
