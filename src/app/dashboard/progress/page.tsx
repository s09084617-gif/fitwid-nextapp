import { ProgressPhotos } from "@/components/progress/progress-photos";
import { WeightHistory } from "@/components/progress/weight-history";
import { BodyFatHistory } from "@/components/progress/body-fat-history";
import { MeasurementsTracker } from "@/components/progress/measurements-tracker";
import { PersonalRecords } from "@/components/progress/personal-records";
import { WorkoutStreaks } from "@/components/progress/workout-streaks";
import { WorkoutHistory } from "@/components/progress/workout-history";
import { WeeklyReport } from "@/components/progress/weekly-report";

export default function DashboardProgressPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Progress Tracking</h1>
        <p className="text-sm text-muted">
          Weight, body fat, measurements, photos, PRs, streaks — all in one
          place.
        </p>
      </div>

      <WeeklyReport />
      <WorkoutStreaks />
      <WeightHistory />
      <BodyFatHistory />
      <MeasurementsTracker />
      <PersonalRecords />
      <ProgressPhotos />
      <WorkoutHistory />
    </div>
  );
}
