import { ExerciseLibrary } from "@/components/exercises/exercise-library";
import { EXERCISES } from "@/lib/workout-data";

export default function DashboardExercisesPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Exercise Library</h1>
        <p className="text-sm text-muted">
          {EXERCISES.length} exercises with form cues, common mistakes,
          alternatives, and progressions.
        </p>
      </div>
      <ExerciseLibrary />
    </div>
  );
}
