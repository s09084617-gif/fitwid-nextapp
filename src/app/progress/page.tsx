import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProgressPhotos } from "@/components/progress/progress-photos";
import { WeightHistory } from "@/components/progress/weight-history";
import { MeasurementsTracker } from "@/components/progress/measurements-tracker";
import { WorkoutHistory } from "@/components/progress/workout-history";

export default function ProgressPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-4">
            <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
              Your Journey
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              Progress Tracking
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              Weight, measurements, photos, and workout history — all in one
              place.
            </p>
          </div>

          <WeightHistory />
          <MeasurementsTracker />
          <ProgressPhotos />
          <WorkoutHistory />
        </div>
      </main>
      <Footer />
    </>
  );
}
