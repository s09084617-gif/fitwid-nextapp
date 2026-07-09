import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default function DashboardAnalyticsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Progress Analytics</h1>
        <p className="text-sm text-muted">
          Weight, body fat, muscle mass, calorie targets, and workout
          adherence — all in one view.
        </p>
      </div>
      <AnalyticsCharts />
    </div>
  );
}
