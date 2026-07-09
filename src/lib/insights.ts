export interface Insight {
  id: string;
  category: "missed_workout" | "plateau" | "rapid_change" | "adherence" | "recovery";
  severity: "info" | "warning" | "attention";
  title: string;
  message: string;
}

interface InsightInput {
  weightLog: { date: string; weightKg: number }[];
  workoutDates: string[]; // ISO dates, one per logged workout
  habitLogs: { date: string; sleepHours?: number; stressLevel?: string }[];
}

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
}

export function generateInsights(input: InsightInput): Insight[] {
  const insights: Insight[] = [];
  const today = new Date().toISOString().slice(0, 10);

  // 1. Missed workouts — gap since last logged session
  const sortedWorkouts = [...input.workoutDates].sort();
  if (sortedWorkouts.length > 0) {
    const lastWorkout = sortedWorkouts[sortedWorkouts.length - 1];
    const gap = daysBetween(lastWorkout, today);
    if (gap >= 7) {
      insights.push({
        id: "missed-workout",
        category: "missed_workout",
        severity: "attention",
        title: "No workouts logged in over a week",
        message: `It's been ${gap} days since your last logged workout. A short session today can restart momentum.`,
      });
    } else if (gap >= 4) {
      insights.push({
        id: "missed-workout",
        category: "missed_workout",
        severity: "warning",
        title: "A few days since your last workout",
        message: `${gap} days since your last logged session — worth getting one in soon.`,
      });
    }
  }

  // 2. Weight plateau — last 4+ entries within a tight range over 3+ weeks
  const sortedWeights = [...input.weightLog].sort((a, b) => a.date.localeCompare(b.date));
  if (sortedWeights.length >= 4) {
    const recent = sortedWeights.slice(-4);
    const span = daysBetween(recent[0].date, recent[recent.length - 1].date);
    const spread = Math.max(...recent.map((r) => r.weightKg)) - Math.min(...recent.map((r) => r.weightKg));
    if (span >= 18 && spread < 0.8) {
      insights.push({
        id: "plateau",
        category: "plateau",
        severity: "info",
        title: "Weight has plateaued",
        message: `Your weight has stayed within ${spread.toFixed(1)}kg over the last ${span} days. Consider adjusting calories, increasing training volume, or checking in with your coach.`,
      });
    }
  }

  // 3. Rapid weight change — >1.5% bodyweight change week-over-week
  if (sortedWeights.length >= 2) {
    const weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7);
    const weekAgoIso = weekAgoDate.toISOString().slice(0, 10);
    const before = sortedWeights.filter((w) => w.date <= weekAgoIso).slice(-1)[0];
    const latest = sortedWeights[sortedWeights.length - 1];
    if (before && latest && before.date !== latest.date) {
      const pctChange = ((latest.weightKg - before.weightKg) / before.weightKg) * 100;
      if (Math.abs(pctChange) >= 1.5) {
        insights.push({
          id: "rapid-change",
          category: "rapid_change",
          severity: "warning",
          title: `Rapid weight ${pctChange > 0 ? "gain" : "loss"} this week`,
          message: `${Math.abs(pctChange).toFixed(1)}% bodyweight change in about a week. This can be water/sodium/carb shifts rather than real fat/muscle change — worth noting but not panicking over.`,
        });
      }
    }
  }

  // 4. Poor adherence — this week's workout count vs recent 4-week average
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const fourWeeksAgoIso = fourWeeksAgo.toISOString().slice(0, 10);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoIso = oneWeekAgo.toISOString().slice(0, 10);

  const last4WeeksCount = sortedWorkouts.filter((d) => d >= fourWeeksAgoIso).length;
  const thisWeekCount = sortedWorkouts.filter((d) => d >= oneWeekAgoIso).length;
  const avgPerWeek = last4WeeksCount / 4;

  if (avgPerWeek >= 1.5 && thisWeekCount < avgPerWeek * 0.5) {
    insights.push({
      id: "adherence",
      category: "adherence",
      severity: "warning",
      title: "Workout frequency dropped this week",
      message: `You've averaged ~${avgPerWeek.toFixed(1)} workouts/week recently but only logged ${thisWeekCount} this week. Life happens — just flagging the dip.`,
    });
  }

  // 5. Recovery issues — low sleep or high stress trend, or training with no rest days
  const recentHabits = input.habitLogs.filter((h) => h.date >= fourWeeksAgoIso);
  const sleepValues = recentHabits.map((h) => h.sleepHours).filter((v): v is number => v !== undefined);
  if (sleepValues.length >= 3) {
    const avgSleep = sleepValues.reduce((s, v) => s + v, 0) / sleepValues.length;
    if (avgSleep < 6) {
      insights.push({
        id: "recovery-sleep",
        category: "recovery",
        severity: "attention",
        title: "Averaging under 6 hours of sleep",
        message: `Your logged sleep has averaged ${avgSleep.toFixed(1)}h recently. This affects recovery, fat loss, and workout performance more than almost anything else.`,
      });
    }
  }

  const highStressCount = recentHabits.filter((h) => h.stressLevel === "high").length;
  if (recentHabits.length >= 4 && highStressCount / recentHabits.length >= 0.5) {
    insights.push({
      id: "recovery-stress",
      category: "recovery",
      severity: "warning",
      title: "Frequent high stress logged",
      message: "High stress on more than half your recent check-ins. Chronic stress can stall recovery and fat loss even with perfect training and diet.",
    });
  }

  // No rest days in the last 7 days despite training every day
  const last7 = sortedWorkouts.filter((d) => d >= oneWeekAgoIso);
  if (last7.length >= 7) {
    insights.push({
      id: "recovery-no-rest",
      category: "recovery",
      severity: "warning",
      title: "No rest days in the last week",
      message: "You've trained every day this week. Consider a rest or light-activity day to let recovery catch up.",
    });
  }

  return insights;
}
