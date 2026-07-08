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
