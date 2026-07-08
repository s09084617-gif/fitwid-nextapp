import { EXERCISES, type Exercise, type Equipment, type Difficulty, type MuscleGroup } from "@/lib/workout-data";

export type Goal = "fat_loss" | "muscle_gain" | "strength" | "endurance";
export type Focus =
  | "full_body"
  | "upper_body"
  | "lower_body"
  | "push"
  | "pull"
  | "legs"
  | "core"
  | "cardio";

export interface GeneratorFilters {
  goal: Goal;
  experience: Difficulty;
  equipment: Equipment[];
  focus: Focus;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  restSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  title: string;
  filters: GeneratorFilters;
  exercises: WorkoutExercise[];
  estimatedMinutes: number;
}

const FOCUS_MUSCLE_MAP: Record<Focus, MuscleGroup[]> = {
  full_body: ["quads", "hamstrings", "glutes", "chest", "back", "shoulders", "core"],
  upper_body: ["chest", "back", "shoulders", "biceps", "triceps"],
  lower_body: ["quads", "hamstrings", "glutes", "calves"],
  push: ["chest", "shoulders", "triceps"],
  pull: ["back", "biceps"],
  legs: ["quads", "hamstrings", "glutes", "calves"],
  core: ["core"],
  cardio: ["cardio"],
};

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const GOAL_SCHEME: Record<
  Goal,
  { sets: number; reps: string; restSeconds: number; label: string }
> = {
  fat_loss: { sets: 3, reps: "15-20", restSeconds: 30, label: "Fat Loss (circuit style)" },
  muscle_gain: { sets: 4, reps: "8-12", restSeconds: 75, label: "Muscle Gain (hypertrophy)" },
  strength: { sets: 5, reps: "3-6", restSeconds: 150, label: "Strength (heavy, low rep)" },
  endurance: { sets: 3, reps: "20-25", restSeconds: 25, label: "Endurance (high rep)" },
};

const EXERCISE_COUNT_BY_EXPERIENCE: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 6,
  advanced: 8,
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateWorkout(filters: GeneratorFilters): WorkoutPlan {
  const { goal, experience, equipment, focus } = filters;
  const targetMuscles = FOCUS_MUSCLE_MAP[focus];
  const maxDifficulty = DIFFICULTY_RANK[experience];

  const pool = EXERCISES.filter(
    (ex) =>
      targetMuscles.includes(ex.muscleGroup) &&
      equipment.includes(ex.equipment) &&
      DIFFICULTY_RANK[ex.difficulty] <= maxDifficulty
  );

  const targetCount = EXERCISE_COUNT_BY_EXPERIENCE[experience];

  // Spread picks across muscle groups first (one per group), then fill
  // remaining slots randomly from whatever's left in the pool.
  const selected: Exercise[] = [];
  const byGroup = new Map<MuscleGroup, Exercise[]>();
  for (const ex of shuffle(pool)) {
    const list = byGroup.get(ex.muscleGroup) ?? [];
    list.push(ex);
    byGroup.set(ex.muscleGroup, list);
  }
  for (const group of shuffle(targetMuscles)) {
    const list = byGroup.get(group);
    if (list && list.length > 0 && selected.length < targetCount) {
      selected.push(list.shift()!);
    }
  }
  const remaining = shuffle(pool.filter((ex) => !selected.includes(ex)));
  while (selected.length < targetCount && remaining.length > 0) {
    selected.push(remaining.shift()!);
  }

  const scheme = GOAL_SCHEME[goal];
  const workoutExercises: WorkoutExercise[] = selected.map((exercise) => ({
    exercise,
    sets: scheme.sets,
    reps: scheme.reps,
    restSeconds: scheme.restSeconds,
  }));

  const secondsPerSet = 40; // rough time under tension per set
  const totalSeconds = workoutExercises.reduce(
    (sum, we) => sum + we.sets * (secondsPerSet + we.restSeconds),
    0
  );
  const estimatedMinutes = Math.max(15, Math.round(totalSeconds / 60));

  const focusLabel = focus
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: `wk_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    title: `${focusLabel} — ${scheme.label}`,
    filters,
    exercises: workoutExercises,
    estimatedMinutes,
  };
}
