import type { Gender, ActivityLevel, Goal } from "@/lib/assessment";
import { calculateBMR } from "@/lib/assessment";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export interface NutritionInput {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinPerKg: number;
}

const GOAL_ADJUSTMENT: Record<Goal, { calorieDelta: number; proteinPerKg: number }> = {
  fat_loss: { calorieDelta: -500, proteinPerKg: 2.0 },
  muscle_gain: { calorieDelta: 300, proteinPerKg: 1.8 },
  maintain: { calorieDelta: 0, proteinPerKg: 1.6 },
};

export function calculateNutritionTargets(input: NutritionInput): MacroTargets {
  const bmr = calculateBMR(input);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[input.activityLevel];

  const { calorieDelta, proteinPerKg } = GOAL_ADJUSTMENT[input.goal];
  const minCalories = input.gender === "male" ? 1500 : 1200;
  const calories = Math.max(minCalories, Math.round(tdee + calorieDelta));

  const proteinG = Math.round(proteinPerKg * input.weightKg);
  const proteinCalories = proteinG * 4;

  // Split remaining calories 55% carbs / 45% fat (typical moderate-carb split)
  const remainingCalories = Math.max(0, calories - proteinCalories);
  const carbsG = Math.round((remainingCalories * 0.55) / 4);
  const fatG = Math.round((remainingCalories * 0.45) / 9);

  return {
    calories,
    proteinG,
    carbsG,
    fatG,
    proteinPerKg,
  };
}

/**
 * Daily water intake estimate in liters: ~35ml per kg bodyweight, plus an
 * extra 500-750ml for higher activity levels to cover sweat losses.
 * A general guideline, not a medical recommendation — actual needs vary
 * with climate, individual sweat rate, and health conditions.
 */
export function calculateWaterIntakeLiters(
  weightKg: number,
  activityLevel: ActivityLevel
): number {
  const base = weightKg * 0.035;
  const ACTIVITY_BONUS_LITERS: Record<ActivityLevel, number> = {
    sedentary: 0,
    light: 0.25,
    moderate: 0.5,
    active: 0.65,
    very_active: 0.75,
  };
  return Math.round((base + ACTIVITY_BONUS_LITERS[activityLevel]) * 10) / 10;
}
