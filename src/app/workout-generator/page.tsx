import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WorkoutGeneratorForm } from "@/components/workout/workout-generator-form";
import { SavedWorkouts } from "@/components/workout/saved-workouts";

export default function WorkoutGeneratorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.3em] text-xs font-semibold uppercase mb-3">
              Free Tool
            </p>
            <h1 className="font-display text-4xl sm:text-5xl mb-4">
              Workout Generator
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              Pick your goal, experience level, and equipment — get a workout
              in seconds. Regenerate for variety, save the ones you like.
            </p>
          </div>

          <WorkoutGeneratorForm />

          <div className="mt-6">
            <SavedWorkouts />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
