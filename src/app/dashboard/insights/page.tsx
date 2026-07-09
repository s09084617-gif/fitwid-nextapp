import { InsightsPanel } from "@/components/insights/insights-panel";

export default function InsightsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">AI Insights</h1>
        <p className="text-sm text-muted">
          Patterns automatically detected from your workouts, weight, and
          habits — missed sessions, plateaus, rapid changes, and recovery
          flags.
        </p>
      </div>
      <InsightsPanel />
    </div>
  );
}
