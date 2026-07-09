import { HabitTracker } from "@/components/habits/habit-tracker";

export default function DashboardHabitsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Habit Tracker</h1>
        <p className="text-sm text-muted">
          Water, sleep, steps, protein, workouts, and meditation — log daily,
          see your week at a glance.
        </p>
      </div>
      <HabitTracker />
    </div>
  );
}
