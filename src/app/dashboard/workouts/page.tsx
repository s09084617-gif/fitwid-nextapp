import { WorkoutGeneratorForm } from "@/components/workout/workout-generator-form";
import { SavedWorkouts } from "@/components/workout/saved-workouts";

export default function DashboardWorkoutsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Workout Generator</h1>
        <p className="text-sm text-muted">
          Personalized using your Body Assessment data where available —
          goal, experience, equipment, and injuries. Generate a single
          session or a full weekly schedule, save your favorites, and
          print or save as PDF.
        </p>
      </div>

      <WorkoutGeneratorForm />
      <SavedWorkouts />
    </div>
  );
}
