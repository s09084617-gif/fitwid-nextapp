import { INDIAN_FOODS, type FoodItem, type DietTag } from "@/lib/indian-foods";
import type { MacroTargets } from "@/lib/nutrition";

export type MealSlot = "Breakfast" | "Lunch" | "Snack" | "Dinner";

const MEAL_CALORIE_SHARE: Record<MealSlot, number> = {
  Breakfast: 0.25,
  Lunch: 0.35,
  Snack: 0.1,
  Dinner: 0.3,
};

// Rough category mix per meal slot, in priority order.
const MEAL_CATEGORY_MIX: Record<MealSlot, FoodItem["category"][]> = {
  Breakfast: ["grains", "protein", "dairy", "fruits"],
  Lunch: ["grains", "legumes", "protein", "vegetables", "breads"],
  Snack: ["snacks", "fruits", "dairy"],
  Dinner: ["breads", "legumes", "protein", "vegetables"],
};

export const MEAL_TIMING: Record<MealSlot, string> = {
  Breakfast: "7:00 – 8:00 AM",
  Lunch: "1:00 – 2:00 PM",
  Snack: "4:30 – 5:30 PM",
  Dinner: "7:30 – 8:30 PM",
};

export interface MealPlanItem {
  slot: MealSlot;
  foods: FoodItem[];
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface MealPlan {
  id: string;
  createdAt: string;
  dietTag: DietTag;
  targets: MacroTargets;
  meals: MealPlanItem[];
  totals: { calories: number; proteinG: number; carbsG: number; fatG: number };
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildMeal(
  slot: MealSlot,
  calorieTarget: number,
  pool: FoodItem[]
): MealPlanItem {
  const categories = MEAL_CATEGORY_MIX[slot];
  const chosen: FoodItem[] = [];
  let runningCalories = 0;

  for (const category of categories) {
    if (runningCalories >= calorieTarget) break;
    const options = shuffle(pool.filter((f) => f.category === category));
    if (options.length === 0) continue;
    chosen.push(options[0]);
    runningCalories += options[0].calories;
  }

  // If still well under target, add one more item from the widest pool.
  if (runningCalories < calorieTarget * 0.7) {
    const extra = shuffle(pool.filter((f) => !chosen.includes(f)))[0];
    if (extra) {
      chosen.push(extra);
      runningCalories += extra.calories;
    }
  }

  return {
    slot,
    foods: chosen,
    calories: chosen.reduce((s, f) => s + f.calories, 0),
    proteinG: chosen.reduce((s, f) => s + f.proteinG, 0),
    carbsG: chosen.reduce((s, f) => s + f.carbsG, 0),
    fatG: chosen.reduce((s, f) => s + f.fatG, 0),
  };
}

export function generateMealPlan(
  targets: MacroTargets,
  dietTag: DietTag
): MealPlan {
  const pool = INDIAN_FOODS.filter((f) => f.dietTags.includes(dietTag));

  const meals = (Object.keys(MEAL_CALORIE_SHARE) as MealSlot[]).map((slot) =>
    buildMeal(slot, targets.calories * MEAL_CALORIE_SHARE[slot], pool)
  );

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  return {
    id: `meal_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    dietTag,
    targets,
    meals,
    totals,
  };
}

// ============================================================
// Weekly Nutrition Planner (v2) — additive, doesn't touch the
// single-day 4-slot generator above, which keeps working as-is.
// ============================================================

export type BudgetTier = "low" | "medium" | "high";
export type WeeklySlot =
  | "Breakfast"
  | "MidMorningSnack"
  | "Lunch"
  | "EveningSnack"
  | "PreWorkout"
  | "PostWorkout"
  | "Dinner";

export const WEEKLY_SLOT_LABELS: Record<WeeklySlot, string> = {
  Breakfast: "Breakfast",
  MidMorningSnack: "Mid-Morning Snack",
  Lunch: "Lunch",
  EveningSnack: "Evening Snack",
  PreWorkout: "Pre-Workout",
  PostWorkout: "Post-Workout",
  Dinner: "Dinner",
};

export const WEEKLY_MEAL_TIMING: Record<WeeklySlot, string> = {
  Breakfast: "7:00 – 8:00 AM",
  MidMorningSnack: "10:30 – 11:00 AM",
  Lunch: "1:00 – 2:00 PM",
  EveningSnack: "4:30 – 5:00 PM",
  PreWorkout: "5:30 – 6:00 PM",
  PostWorkout: "7:15 – 7:45 PM",
  Dinner: "8:30 – 9:00 PM",
};

// Calorie share per slot. Training days carve pre/post-workout out of the
// main meals; rest days skip those two slots and redistribute the calories.
const REST_DAY_SHARE: Partial<Record<WeeklySlot, number>> = {
  Breakfast: 0.25,
  MidMorningSnack: 0.08,
  Lunch: 0.32,
  EveningSnack: 0.08,
  Dinner: 0.27,
};
const TRAINING_DAY_SHARE: Record<WeeklySlot, number> = {
  Breakfast: 0.22,
  MidMorningSnack: 0.07,
  Lunch: 0.27,
  EveningSnack: 0.07,
  PreWorkout: 0.1,
  PostWorkout: 0.1,
  Dinner: 0.17,
};

const WEEKLY_CATEGORY_MIX: Record<WeeklySlot, FoodItem["category"][]> = {
  Breakfast: ["grains", "protein", "dairy", "fruits"],
  MidMorningSnack: ["fruits", "snacks", "dairy"],
  Lunch: ["grains", "legumes", "protein", "vegetables", "breads"],
  EveningSnack: ["snacks", "fruits", "dairy"],
  PreWorkout: ["fruits", "grains", "snacks"],
  PostWorkout: ["protein", "dairy", "fruits"],
  Dinner: ["breads", "legumes", "protein", "vegetables"],
};

export interface WeeklyMealPlanItem {
  slot: WeeklySlot;
  foods: FoodItem[];
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  isFavorite?: boolean;
}

export interface WeeklyMealPlanDay {
  dayNumber: number; // 1-7
  isTrainingDay: boolean;
  meals: WeeklyMealPlanItem[];
}

export interface WeeklyMealPlan {
  id: string;
  createdAt: string;
  title: string;
  goal: string;
  dietTag: DietTag;
  budgetTier: BudgetTier;
  targets: MacroTargets;
  days: WeeklyMealPlanDay[];
}

function budgetPool(pool: FoodItem[], budgetTier: BudgetTier): FoodItem[] {
  // "low" budget = only low-cost items. "medium" = low + medium.
  // "high" = everything, no restriction.
  const allowed: BudgetTier[] =
    budgetTier === "low" ? ["low"] : budgetTier === "medium" ? ["low", "medium"] : ["low", "medium", "high"];
  const filtered = pool.filter((f) => allowed.includes(f.budgetTier));
  return filtered.length > 0 ? filtered : pool; // never return an empty pool
}

function buildWeeklyMeal(
  slot: WeeklySlot,
  calorieTarget: number,
  pool: FoodItem[]
): WeeklyMealPlanItem {
  const categories = WEEKLY_CATEGORY_MIX[slot];
  const chosen: FoodItem[] = [];
  let runningCalories = 0;

  for (const category of categories) {
    if (runningCalories >= calorieTarget) break;
    const options = shuffle(pool.filter((f) => f.category === category));
    if (options.length === 0) continue;
    chosen.push(options[0]);
    runningCalories += options[0].calories;
  }
  if (runningCalories < calorieTarget * 0.7) {
    const extra = shuffle(pool.filter((f) => !chosen.includes(f)))[0];
    if (extra) {
      chosen.push(extra);
      runningCalories += extra.calories;
    }
  }

  return {
    slot,
    foods: chosen,
    calories: chosen.reduce((s, f) => s + f.calories, 0),
    proteinG: chosen.reduce((s, f) => s + f.proteinG, 0),
    carbsG: chosen.reduce((s, f) => s + f.carbsG, 0),
    fatG: chosen.reduce((s, f) => s + f.fatG, 0),
  };
}

function buildWeeklyDay(
  dayNumber: number,
  isTrainingDay: boolean,
  targets: MacroTargets,
  pool: FoodItem[]
): WeeklyMealPlanDay {
  const share = isTrainingDay ? TRAINING_DAY_SHARE : REST_DAY_SHARE;
  const slots = Object.keys(share) as WeeklySlot[];
  const meals = slots.map((slot) =>
    buildWeeklyMeal(slot, targets.calories * (share[slot] ?? 0), pool)
  );
  return { dayNumber, isTrainingDay, meals };
}

/** Generates a full 7-day plan. `workoutDaysPerWeek` determines how many
 * of the 7 days get Pre-Workout/Post-Workout slots (the first N days are
 * treated as training days — a simple, real use of the user's actual
 * training frequency without needing a separately-stored weekly schedule). */
export function generateWeeklyMealPlan(
  targets: MacroTargets,
  dietTag: DietTag,
  budgetTier: BudgetTier,
  goal: string,
  workoutDaysPerWeek: number = 4
): WeeklyMealPlan {
  const dietPool = INDIAN_FOODS.filter((f) => f.dietTags.includes(dietTag));
  const pool = budgetPool(dietPool, budgetTier);
  const trainingDays = Math.min(7, Math.max(0, Math.round(workoutDaysPerWeek)));

  const days: WeeklyMealPlanDay[] = Array.from({ length: 7 }, (_, i) =>
    buildWeeklyDay(i + 1, i < trainingDays, targets, pool)
  );

  return {
    id: `wmp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    title: `7-Day ${dietTag === "veg" ? "Vegetarian" : dietTag === "vegan" ? "Vegan" : dietTag === "egg" ? "Eggetarian" : "Non-Veg"} Plan`,
    goal,
    dietTag,
    budgetTier,
    targets,
    days,
  };
}

/** Regenerates a single meal (one day, one slot) in place, leaving the
 * rest of the plan untouched. Returns a new plan object (immutable
 * update) so React state updates trigger re-renders correctly. */
export function swapWeeklyMeal(
  plan: WeeklyMealPlan,
  dayNumber: number,
  slot: WeeklySlot
): WeeklyMealPlan {
  const dietPool = INDIAN_FOODS.filter((f) => f.dietTags.includes(plan.dietTag));
  const pool = budgetPool(dietPool, plan.budgetTier);
  const day = plan.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return plan;

  const share = day.isTrainingDay ? TRAINING_DAY_SHARE : REST_DAY_SHARE;
  const calorieTarget = plan.targets.calories * (share[slot] ?? 0.15);
  const newMeal = buildWeeklyMeal(slot, calorieTarget, pool);

  return {
    ...plan,
    days: plan.days.map((d) =>
      d.dayNumber !== dayNumber
        ? d
        : { ...d, meals: d.meals.map((m) => (m.slot === slot ? newMeal : m)) }
    ),
  };
}
