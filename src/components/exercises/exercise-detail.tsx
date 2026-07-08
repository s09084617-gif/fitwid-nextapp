import { Video, AlertTriangle, ArrowUpCircle, ArrowDownCircle, ListChecks } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXERCISES, type Exercise } from "@/lib/workout-data";

const DIFFICULTY_VARIANT = {
  beginner: "success",
  intermediate: "gold",
  advanced: "danger",
} as const;

function findExercise(id: string | null): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id) ?? undefined;
}

export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const alternatives = exercise.alternatives.map(findExercise).filter(Boolean) as Exercise[];
  const easier = findExercise(exercise.progressionEasier);
  const harder = findExercise(exercise.progressionHarder);

  return (
    <div className="space-y-6">
      {/* Video placeholder */}
      <Card className="aspect-video flex flex-col items-center justify-center bg-surface-2 text-center">
        <Video size={32} className="text-muted mb-3" />
        <p className="text-sm font-medium mb-1">Demo video coming soon</p>
        <p className="text-xs text-muted max-w-xs">
          HD demonstration footage isn&apos;t filmed yet — form cues below
          cover the key technique points in the meantime.
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="crimson">{exercise.muscleGroup}</Badge>
          <Badge variant="neutral">{exercise.equipment}</Badge>
          <Badge variant={DIFFICULTY_VARIANT[exercise.difficulty]}>
            {exercise.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-2xl mb-4">{exercise.name}</CardTitle>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-2 flex items-center gap-1.5">
              <ListChecks size={14} /> Form Cues
            </p>
            <ul className="space-y-1.5">
              {exercise.cues.map((c) => (
                <li key={c} className="text-sm text-foreground/90 flex gap-2">
                  <span className="text-crimson">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-warning mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Common Mistakes
            </p>
            <ul className="space-y-1.5">
              {exercise.commonMistakes.map((m) => (
                <li key={m} className="text-sm text-muted flex gap-2">
                  <span className="text-warning">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {(easier || harder) && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-3">
            Progressions
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {easier && (
              <div className="rounded-md border border-border p-3 flex items-center gap-3">
                <ArrowDownCircle size={18} className="text-success shrink-0" />
                <div>
                  <p className="text-[10px] text-muted uppercase">Easier</p>
                  <p className="text-sm font-medium">{easier.name}</p>
                </div>
              </div>
            )}
            {harder && (
              <div className="rounded-md border border-border p-3 flex items-center gap-3">
                <ArrowUpCircle size={18} className="text-danger shrink-0" />
                <div>
                  <p className="text-[10px] text-muted uppercase">Harder</p>
                  <p className="text-sm font-medium">{harder.name}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {alternatives.length > 0 && (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-3">
            Alternatives (different equipment)
          </p>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((alt) => (
              <Badge key={alt.id} variant="neutral">
                {alt.name} ({alt.equipment})
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
