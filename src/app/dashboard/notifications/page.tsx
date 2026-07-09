import { NotificationCenter } from "@/components/notifications/notification-center";

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Notifications</h1>
        <p className="text-sm text-muted">
          Workout, meal, water, weekly report, and coach message reminders —
          computed from your real activity.
        </p>
      </div>
      <NotificationCenter />
    </div>
  );
}
