"use client";

import { useState } from "react";
import { WeeklyPlannerForm } from "@/components/nutrition/weekly-planner-form";
import { FavoriteMeals } from "@/components/nutrition/favorite-meals";
import { SavedWeeklyPlans } from "@/components/nutrition/saved-weekly-plans";
import { NutritionCalculator } from "@/components/nutrition/nutrition-calculator";
import { MealPlanDisplay } from "@/components/nutrition/meal-plan-display";
import { GroceryList } from "@/components/nutrition/grocery-list";
import { FoodDatabase } from "@/components/nutrition/food-database";
import { SavedMealPlans } from "@/components/nutrition/saved-meal-plans";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateMealPlan, type MealPlan } from "@/lib/meal-plan-generator";
import { saveMealPlan } from "@/lib/db/user-data";
import type { MacroTargets } from "@/lib/nutrition";
import type { DietTag } from "@/lib/indian-foods";

export default function DashboardNutritionPage() {
  const [showLegacyTools, setShowLegacyTools] = useState(false);
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

  async function handleSave() {
    if (!plan) return;
    await saveMealPlan(plan);
    setSaved(true);
    window.dispatchEvent(new CustomEvent("fitwid:mealplans-updated"));
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl mb-2">Nutrition Planner</h1>
        <p className="text-sm text-muted">
          A full 7-day Indian meal plan, personalized from your Body
          Assessment — with pre/post-workout meals on your training days.
        </p>
      </div>

      <WeeklyPlannerForm />
      <FavoriteMeals />
      <SavedWeeklyPlans />

      <div className="pt-4 border-t border-border">
        <button
          onClick={() => setShowLegacyTools((v) => !v)}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition"
        >
          <Badge variant="neutral">Classic Tools</Badge>
          {showLegacyTools ? "Hide" : "Show"} single-day calculator & food database
        </button>
      </div>

      {showLegacyTools && (
        <div className="space-y-6">
          <NutritionCalculator onCalculated={handleCalculated} />

          {targets && !plan && (
            <Button size="lg" className="w-full" onClick={handleGeneratePlan}>
              Generate Single-Day Meal Plan
            </Button>
          )}

          {plan && (
            <>
              <MealPlanDisplay plan={plan} onSave={handleSave} onRegenerate={handleGeneratePlan} saved={saved} />
              <GroceryList plan={plan} />
            </>
          )}

          <SavedMealPlans />
          <FoodDatabase />
        </div>
      )}
    </div>
  );
}
