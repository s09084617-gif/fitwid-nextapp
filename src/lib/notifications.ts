import type { HabitLog, WorkoutHistoryEntry, ClientAssignment } from "@/lib/db/user-data";
import { MEAL_TIMING } from "@/lib/meal-plan-generator";

export interface AppNotification {
  id: string;
  type: "workout" | "meal" | "water" | "weekly_report" | "coach";
  title: string;
  message: string;
  urgent: boolean;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function buildNotifications(input: {
  workoutHistory: WorkoutHistoryEntry[];
  todayHabit: HabitLog | undefined;
  assignment: ClientAssignment | null;
  weeklyWorkoutCount: number;
}): AppNotification[] {
  const notifications: AppNotification[] = [];
  const hour = new Date().getHours();
  const workedOutToday = input.workoutHistory.some((w) => w.date === todayISO());

  if (!workedOutToday && hour >= 17) {
    notifications.push({
      id: "workout-reminder",
      type: "workout",
      title: "No workout logged today",
      message: "It's evening and you haven't logged a session yet — even a short one keeps your streak alive.",
      urgent: true,
    });
  }

  if (hour >= 12 && hour < 14) {
    notifications.push({
      id: "meal-lunch",
      type: "meal",
      title: "Lunch window",
      message: `Your suggested lunch time is ${MEAL_TIMING.Lunch}.`,
      urgent: false,
    });
  }
  if (hour >= 19 && hour < 21) {
    notifications.push({
      id: "meal-dinner",
      type: "meal",
      title: "Dinner window",
      message: `Your suggested dinner time is ${MEAL_TIMING.Dinner}.`,
      urgent: false,
    });
  }

  const waterLogged = (input.todayHabit?.waterMl ?? 0) > 0;
  if (!waterLogged && hour >= 14) {
    notifications.push({
      id: "water-reminder",
      type: "water",
      title: "Log your water intake",
      message: "You haven't logged water today — aim for ~3L across the day.",
      urgent: false,
    });
  }

  if (new Date().getDay() === 0) {
    notifications.push({
      id: "weekly-report",
      type: "weekly_report",
      title: "Weekly report ready",
      message: `You logged ${input.weeklyWorkoutCount} workout${input.weeklyWorkoutCount === 1 ? "" : "s"} this week. Check Progress → This Week's Report for the full breakdown.`,
      urgent: false,
    });
  }

  if (input.assignment?.coachNotes && input.assignment.updatedAt) {
    const daysSince = Math.floor(
      (Date.now() - new Date(input.assignment.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince <= 7) {
      notifications.push({
        id: "coach-note",
        type: "coach",
        title: "New note from your coach",
        message: input.assignment.coachNotes,
        urgent: true,
      });
    }
  }

  return notifications;
}
