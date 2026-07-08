export interface StreakResult {
  current: number;
  longest: number;
}

/** Computes current and longest streaks (in days) from a list of ISO dates.
 * "Current" allows today or yesterday as the most recent entry (so the
 * streak doesn't reset to 0 just because you haven't logged yet today). */
export function calculateStreak(dates: string[]): StreakResult {
  if (dates.length === 0) return { current: 0, longest: 0 };

  const uniqueDays = Array.from(new Set(dates)).sort();
  const dayMs = 24 * 60 * 60 * 1000;

  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]).getTime();
    const curr = new Date(uniqueDays[i]).getTime();
    if (curr - prev === dayMs) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  // Current streak: walk backward from the most recent logged day.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDay = new Date(uniqueDays[uniqueDays.length - 1]);
  lastDay.setHours(0, 0, 0, 0);
  const daysSinceLast = Math.round((today.getTime() - lastDay.getTime()) / dayMs);

  let current = 0;
  if (daysSinceLast <= 1) {
    current = 1;
    for (let i = uniqueDays.length - 1; i > 0; i--) {
      const prev = new Date(uniqueDays[i - 1]).getTime();
      const curr = new Date(uniqueDays[i]).getTime();
      if (curr - prev === dayMs) {
        current += 1;
      } else {
        break;
      }
    }
  }

  return { current, longest };
}
