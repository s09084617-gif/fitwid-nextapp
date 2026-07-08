import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AssessmentForm } from "@/components/assessment/assessment-form";

export default function AssessmentPage() {
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
              AI Body Assessment
            </h1>
            <p className="text-muted max-w-lg mx-auto">
              Answer a few questions about your body, goals, and lifestyle —
              get your full metrics, a starter workout, a meal plan, and a
              90-day roadmap, all in one shot.
            </p>
          </div>
          <AssessmentForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
