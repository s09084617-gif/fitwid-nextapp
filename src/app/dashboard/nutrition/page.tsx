"use client";

import { useState } from "react";
import { NutritionCalculator } from "@/components/nutrition/nutrition-calculator";
import { MealPlanDisplay } from "@/components/nutrition/meal-plan-display";
import { FoodDatabase } from "@/components/nutrition/food-database";
import { SavedMealPlans } from "@/components/nutrition/saved-meal-plans";
import { Button } from "@/components/ui/button";
import { generateMealPlan, type MealPlan } from "@/lib/meal-plan-generator";
import { saveMealPlan } from "@/lib/local-store";
import type { MacroTargets } from "@/lib/nutrition";
import type { DietTag } from "@/lib/indian-foods";

export default function DashboardNutritionPage() {
  const [targets, setTargets] = useState<MacroTargets | null>(null);
  const [dietTag, setDietTag] = useState<DietTag>("veg");
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [saved, setSaved] = useState(false);

  function handleCalculated(t: MacroTargets, diet: DietTag) {
    setTargets(t);
    setDietTag(diet);
    setPlan(null);
    setSaved(false);
  }

  function handleGeneratePlan() {
    if (!targets) return;
    setPlan(generateMealPlan(targets, dietTag));
    setSaved(false);
  }

  function handleSave() {
    if (!plan) return;
    saveMealPlan(plan);
    setSaved(true);
    window.dispatchEvent(new CustomEvent("fitwid:mealplans-updated"));
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Nutrition</h1>
        <p className="text-sm text-muted">
          Calculate your calorie and macro targets, then generate an
          Indian-food meal plan built around them.
        </p>
      </div>

      <NutritionCalculator onCalculated={handleCalculated} />

      {targets && !plan && (
        <Button size="lg" className="w-full" onClick={handleGeneratePlan}>
          Generate Meal Plan
        </Button>
      )}

      {plan && (
        <MealPlanDisplay
          plan={plan}
          onSave={handleSave}
          onRegenerate={handleGeneratePlan}
          saved={saved}
        />
      )}

      <SavedMealPlans />
      <FoodDatabase />
    </div>
  );
}
