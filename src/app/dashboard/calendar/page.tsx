import { WorkoutCalendar } from "@/components/calendar/workout-calendar";

export default function DashboardCalendarPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Calendar & Scheduling</h1>
        <p className="text-sm text-muted">
          See your next 14 days, mark rest days, and request PT sessions.
        </p>
      </div>
      <WorkoutCalendar />
      <p className="text-xs text-muted text-center">
        Heads up: there&apos;s no push notification system yet, so
        &ldquo;reminders&rdquo; means this list inside the app — not a text
        or push alert on your phone.
      </p>
    </div>
  );
}
