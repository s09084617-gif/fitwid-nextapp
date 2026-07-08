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
