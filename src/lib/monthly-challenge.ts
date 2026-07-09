export interface MonthlyChallenge {
  title: string;
  description: string;
  target: number;
  unit: string;
  metric: "workouts" | "habitDays" | "weightEntries";
}

const CHALLENGES: MonthlyChallenge[] = [
  { title: "12 Workouts This Month", description: "Log 12 workouts before the month ends.", target: 12, unit: "workouts", metric: "workouts" },
  { title: "Habit Streak Challenge", description: "Log your daily habits 20 days this month.", target: 20, unit: "days", metric: "habitDays" },
  { title: "Consistency Challenge", description: "Log your weight 15 times this month.", target: 15, unit: "entries", metric: "weightEntries" },
];

/** Rotates through challenges by month, so it's the same for everyone in
 * a given month but changes month to month. */
export function getMonthlyChallenge(): MonthlyChallenge {
  const monthIndex = new Date().getMonth();
  return CHALLENGES[monthIndex % CHALLENGES.length];
}
