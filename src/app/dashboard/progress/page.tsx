import { ProgressPhotos } from "@/components/progress/progress-photos";
import { WeightHistory } from "@/components/progress/weight-history";
import { MeasurementsTracker } from "@/components/progress/measurements-tracker";
import { WorkoutHistory } from "@/components/progress/workout-history";

export default function DashboardProgressPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Progress Tracking</h1>
        <p className="text-sm text-muted">
          Weight, measurements, photos, and workout history — all in one
          place.
        </p>
      </div>

      <WeightHistory />
      <MeasurementsTracker />
      <ProgressPhotos />
      <WorkoutHistory />
    </div>
  );
}
