export interface UserStats {
  workoutsLogged: number;
  weightEntries: number;
  assessmentsTaken: number;
  prsLogged: number;
  habitDaysLogged: number;
  currentStreak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

const XP_WEIGHTS = {
  workout: 15,
  weightEntry: 5,
  assessment: 25,
  pr: 20,
  habitDay: 8,
  streakBonus: 3, // per day of current streak, one-time
};

export function calculateXP(stats: UserStats): number {
  return (
    stats.workoutsLogged * XP_WEIGHTS.workout +
    stats.weightEntries * XP_WEIGHTS.weightEntry +
    stats.assessmentsTaken * XP_WEIGHTS.assessment +
    stats.prsLogged * XP_WEIGHTS.pr +
    stats.habitDaysLogged * XP_WEIGHTS.habitDay +
    stats.currentStreak * XP_WEIGHTS.streakBonus
  );
}

const LEVEL_TITLES = [
  "Newcomer", "Getting Started", "Building Momentum", "Consistent", "Dedicated",
  "Disciplined", "Relentless", "Elite", "Iron Will", "FitWid Legend",
];

export function calculateLevel(xp: number): { level: number; title: string; xpIntoLevel: number; xpForNextLevel: number } {
  // Level thresholds grow quadratically: level N needs N*250 total XP
  let level = 1;
  while (xp >= level * 250) {
    level += 1;
  }
  const xpForThisLevel = (level - 1) * 250;
  const xpForNextLevel = level * 250;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xpIntoLevel: xp - xpForThisLevel,
    xpForNextLevel: xpForNextLevel - xpForThisLevel,
  };
}

export function calculateBadges(stats: UserStats): Badge[] {
  return [
    { id: "first_workout", name: "First Rep", description: "Log your first workout", earned: stats.workoutsLogged >= 1 },
    { id: "ten_workouts", name: "In The Groove", description: "Log 10 workouts", earned: stats.workoutsLogged >= 10 },
    { id: "fifty_workouts", name: "Iron Habit", description: "Log 50 workouts", earned: stats.workoutsLogged >= 50 },
    { id: "first_assessment", name: "Know Your Numbers", description: "Complete your first Body Assessment", earned: stats.assessmentsTaken >= 1 },
    { id: "three_assessments", name: "Tracking Progress", description: "Complete 3 Body Assessments", earned: stats.assessmentsTaken >= 3 },
    { id: "first_pr", name: "New Record", description: "Log your first Personal Record", earned: stats.prsLogged >= 1 },
    { id: "five_prs", name: "Record Breaker", description: "Log 5 Personal Records", earned: stats.prsLogged >= 5 },
    { id: "streak_3", name: "Three-Day Spark", description: "Hit a 3-day workout streak", earned: stats.currentStreak >= 3 },
    { id: "streak_7", name: "Full Week", description: "Hit a 7-day workout streak", earned: stats.currentStreak >= 7 },
    { id: "streak_30", name: "Unstoppable", description: "Hit a 30-day workout streak", earned: stats.currentStreak >= 30 },
    { id: "habit_7", name: "Habit Builder", description: "Log habits for 7 days", earned: stats.habitDaysLogged >= 7 },
    { id: "weight_10", name: "Data Driven", description: "Log your weight 10 times", earned: stats.weightEntries >= 10 },
  ];
}
