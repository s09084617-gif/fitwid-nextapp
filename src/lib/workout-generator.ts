import { EXERCISES, type Exercise, type Equipment, type Difficulty, type MuscleGroup } from "@/lib/workout-data";

export type Goal = "fat_loss" | "muscle_gain" | "strength" | "endurance" | "athletic_performance";
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
  /** When set (non-empty), overrides `focus` entirely — lets users pick
   * any combination of individual muscles directly instead of a preset
   * category. */
  muscleGroups?: MuscleGroup[];
  /** Free-text injury notes. Softly deprioritizes (never hard-excludes)
   * exercises for likely-affected muscle groups — see
   * musclesToDeprioritize below. Advisory only, not a substitute for a
   * coach's judgment. */
  injuries?: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: number;
  reps: string;
  restSeconds: number;
  tempo: string;
  /** Alternative exercises resolved from the exercise's `alternatives`
   * ID list into full Exercise objects, for display. */
  alternativeExercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  title: string;
  filters: GeneratorFilters;
  exercises: WorkoutExercise[];
  estimatedMinutes: number;
  isFavorite?: boolean;
  /** Present if injury keywords matched — shown as an advisory note, not
   * a claim that exercises were medically vetted. */
  injuryNote?: string;
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

/** All individually selectable muscle groups, ordered small → big (by
 * typical muscle mass), for the "pick your own muscles" multi-select. */
export const MUSCLE_GROUPS_SMALL_TO_BIG: MuscleGroup[] = [
  "calves",
  "biceps",
  "triceps",
  "shoulders",
  "core",
  "chest",
  "back",
  "hamstrings",
  "glutes",
  "quads",
  "cardio",
];

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  calves: "Calves",
  biceps: "Biceps",
  triceps: "Triceps",
  shoulders: "Shoulders",
  core: "Core / Abs",
  chest: "Chest",
  back: "Back",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  quads: "Quads",
  cardio: "Cardio",
};

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const GOAL_SCHEME: Record<
  Goal,
  { sets: number; reps: string; restSeconds: number; tempo: string; label: string }
> = {
  fat_loss: { sets: 3, reps: "15-20", restSeconds: 30, tempo: "2-0-2", label: "Fat Loss (circuit style)" },
  muscle_gain: { sets: 4, reps: "8-12", restSeconds: 75, tempo: "3-1-1", label: "Muscle Gain (hypertrophy)" },
  strength: { sets: 5, reps: "3-6", restSeconds: 150, tempo: "4-1-1", label: "Strength (heavy, low rep)" },
  endurance: { sets: 3, reps: "20-25", restSeconds: 25, tempo: "2-0-2", label: "Endurance (high rep)" },
  athletic_performance: { sets: 4, reps: "5-8", restSeconds: 90, tempo: "1-0-X", label: "Athletic Performance (power & explosiveness)" },
};

/** Maps common free-text injury keywords to muscle groups worth
 * deprioritizing. Deliberately conservative — this softly reorders
 * exercise selection away from likely-aggravating movements, it never
 * hard-blocks a muscle group entirely (some exercises for that area are
 * often still appropriate; a real coach's judgment matters more than a
 * keyword match). Always shown alongside an explicit disclaimer. */
const INJURY_KEYWORD_MUSCLES: Record<string, MuscleGroup[]> = {
  knee: ["quads", "hamstrings", "glutes", "calves"],
  shoulder: ["shoulders", "chest", "triceps"],
  back: ["back", "hamstrings", "glutes"],
  spine: ["back"],
  wrist: ["chest", "triceps", "shoulders", "biceps"],
  elbow: ["biceps", "triceps"],
  ankle: ["calves", "quads"],
  hip: ["glutes", "quads", "hamstrings"],
  neck: ["shoulders", "back"],
};

function musclesToDeprioritize(injuries: string | undefined): Set<MuscleGroup> {
  const flagged = new Set<MuscleGroup>();
  if (!injuries) return flagged;
  const lower = injuries.toLowerCase();
  for (const [keyword, muscles] of Object.entries(INJURY_KEYWORD_MUSCLES)) {
    if (lower.includes(keyword)) {
      muscles.forEach((m) => flagged.add(m));
    }
  }
  return flagged;
}

/** Explosive/plyometric exercises prioritized when the goal is athletic performance. */
const ATHLETIC_PRIORITY_IDS = ["box-jump", "kb-swing-cardio", "kb-swing", "sprint", "burpee", "jump-rope"];

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

export function generateWorkout(
  filters: GeneratorFilters,
  customExercises: Exercise[] = []
): WorkoutPlan {
  const { goal, experience, equipment, focus, muscleGroups, injuries } = filters;
  const targetMuscles =
    muscleGroups && muscleGroups.length > 0 ? muscleGroups : FOCUS_MUSCLE_MAP[focus];
  const maxDifficulty = DIFFICULTY_RANK[experience];
  const deprioritized = musclesToDeprioritize(injuries);

  const allExercises = [...EXERCISES, ...customExercises];
  const exerciseById = new Map(allExercises.map((ex) => [ex.id, ex]));
  const pool = allExercises.filter(
    (ex) =>
      targetMuscles.includes(ex.muscleGroup) &&
      equipment.includes(ex.equipment) &&
      DIFFICULTY_RANK[ex.difficulty] <= maxDifficulty
  );

  const targetCount = EXERCISE_COUNT_BY_EXPERIENCE[experience];

  // Spread picks across muscle groups first (one per group), then fill
  // remaining slots randomly from whatever's left in the pool. Muscle
  // groups flagged by injury keywords are pushed to the back of the
  // group order, so they're the last to get picked (not excluded, since
  // many exercises for a flagged area are still fine — just deprioritized).
  const selected: Exercise[] = [];
  const byGroup = new Map<MuscleGroup, Exercise[]>();
  for (const ex of shuffle(pool)) {
    const list = byGroup.get(ex.muscleGroup) ?? [];
    list.push(ex);
    byGroup.set(ex.muscleGroup, list);
  }
  const groupOrder = [...shuffle(targetMuscles)].sort((a, b) => {
    const aFlagged = deprioritized.has(a) ? 1 : 0;
    const bFlagged = deprioritized.has(b) ? 1 : 0;
    return aFlagged - bFlagged;
  });
  for (const group of groupOrder) {
    const list = byGroup.get(group);
    if (list && list.length > 0 && selected.length < targetCount) {
      selected.push(list.shift()!);
    }
  }
  const remaining = shuffle(pool.filter((ex) => !selected.includes(ex)));
  while (selected.length < targetCount && remaining.length > 0) {
    selected.push(remaining.shift()!);
  }

  // For athletic performance, swap in an explosive/plyometric movement if
  // one is available in the equipment/difficulty pool and not already picked.
  if (goal === "athletic_performance" && selected.length > 0) {
    const alreadyHasExplosive = selected.some((ex) => ATHLETIC_PRIORITY_IDS.includes(ex.id));
    if (!alreadyHasExplosive) {
      const explosiveOption = allExercises.find(
        (ex) =>
          ATHLETIC_PRIORITY_IDS.includes(ex.id) &&
          equipment.includes(ex.equipment) &&
          DIFFICULTY_RANK[ex.difficulty] <= maxDifficulty
      );
      if (explosiveOption) {
        selected[selected.length - 1] = explosiveOption;
      }
    }
  }

  const scheme = GOAL_SCHEME[goal];
  const workoutExercises: WorkoutExercise[] = selected.map((exercise) => ({
    exercise,
    sets: scheme.sets,
    reps: scheme.reps,
    restSeconds: scheme.restSeconds,
    tempo: scheme.tempo,
    alternativeExercises: exercise.alternatives
      .map((id) => exerciseById.get(id))
      .filter((ex): ex is Exercise => !!ex),
  }));

  const secondsPerSet = 40; // rough time under tension per set
  const totalSeconds = workoutExercises.reduce(
    (sum, we) => sum + we.sets * (secondsPerSet + we.restSeconds),
    0
  );
  const estimatedMinutes = Math.max(15, Math.round(totalSeconds / 60));

  const focusLabel =
    muscleGroups && muscleGroups.length > 0
      ? muscleGroups.map((m) => MUSCLE_GROUP_LABELS[m]).join(" + ")
      : focus
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
    injuryNote:
      deprioritized.size > 0
        ? "Exercises for the area(s) you noted were deprioritized where possible, but always stop and check with your coach or a physio if something doesn't feel right."
        : undefined,
  };
}

export interface ScheduledDay {
  dayIndex: number; // 0-based
  dayLabel: string; // "Day 1", "Day 2", ...
  focus: Focus;
  plan: WorkoutPlan;
}

export interface WeeklySchedule {
  splitLabel: string;
  days: ScheduledDay[];
}

/** Split patterns by training days/week. Rest days aren't listed — the
 * schedule only contains training days; the UI is responsible for
 * showing rest days around them. */
const SPLIT_PATTERNS: Record<number, { label: string; focuses: Focus[] }> = {
  1: { label: "Full Body (1x/week)", focuses: ["full_body"] },
  2: { label: "Full Body (2x/week)", focuses: ["full_body", "full_body"] },
  3: { label: "Full Body (3x/week)", focuses: ["full_body", "full_body", "full_body"] },
  4: { label: "Upper/Lower Split (4x/week)", focuses: ["upper_body", "lower_body", "upper_body", "lower_body"] },
  5: { label: "Push/Pull/Legs + Upper/Lower (5x/week)", focuses: ["push", "pull", "legs", "upper_body", "lower_body"] },
  6: { label: "Push/Pull/Legs x2 (6x/week)", focuses: ["push", "pull", "legs", "push", "pull", "legs"] },
  7: { label: "Push/Pull/Legs x2 + Full Body (7x/week)", focuses: ["push", "pull", "legs", "push", "pull", "legs", "full_body"] },
};

/** Generates a full week's training schedule — one WorkoutPlan per
 * training day, following a split pattern appropriate to how many days
 * the person trains. Each day reuses generateWorkout() so exercise
 * selection, tempo, and injury-awareness all work exactly the same as a
 * single-day plan. */
export function generateWeeklySchedule(
  filters: Omit<GeneratorFilters, "focus" | "muscleGroups">,
  daysPerWeek: number,
  customExercises: Exercise[] = []
): WeeklySchedule {
  const clampedDays = Math.min(7, Math.max(1, Math.round(daysPerWeek)));
  const pattern = SPLIT_PATTERNS[clampedDays];

  const days: ScheduledDay[] = pattern.focuses.map((focus, i) => ({
    dayIndex: i,
    dayLabel: `Day ${i + 1}`,
    focus,
    plan: generateWorkout({ ...filters, focus }, customExercises),
  }));

  return { splitLabel: pattern.label, days };
}
