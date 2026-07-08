import { WorkoutGeneratorForm } from "@/components/workout/workout-generator-form";
import { SavedWorkouts } from "@/components/workout/saved-workouts";

export default function DashboardWorkoutsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Workout Generator</h1>
        <p className="text-sm text-muted">
          Pick your goal, experience level, and equipment — get a workout in
          seconds. Regenerate for variety, save the ones you like.
        </p>
      </div>

      <WorkoutGeneratorForm />
      <SavedWorkouts />
    </div>
  );
}
