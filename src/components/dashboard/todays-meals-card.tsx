"use client";

import { useEffect, useState } from "react";
import { Utensils, Droplet, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getSavedWeeklyMealPlans,
  getNutritionLogsForDate,
  getHabitLogs,
  upsertHabitLog,
  logMealEaten,
  unlogMeal,
  todayISO,
  type SavedWeeklyMealPlan,
} from "@/lib/db/user-data";
import { WEEKLY_SLOT_LABELS, type WeeklySlot } from "@/lib/meal-plan-generator";

function findTodaysDay(plans: SavedWeeklyMealPlan[]) {
  const today = todayISO();
  for (const plan of plans) {
    const created = new Date(plan.createdAt);
    for (const day of plan.days) {
      const d = new Date(created);
      d.setDate(d.getDate() + (day.dayNumber - 1));
      if (d.toISOString().slice(0, 10) === today) {
        return { plan, day };
      }
    }
  }
  return null;
}

export function TodaysMealsCard() {
  const [match, setMatch] = useState<ReturnType<typeof findTodaysDay>>(null);
  const [loggedSlots, setLoggedSlots] = useState<Set<string>>(new Set());
  const [waterMl, setWaterMl] = useState(0);
  const [mounted, setMounted] = useState(false);

  function refresh() {
    Promise.all([getSavedWeeklyMealPlans(), getNutritionLogsForDate(todayISO()), getHabitLogs(1)]).then(
      ([plans, logs, habits]) => {
        setMatch(findTodaysDay(plans));
        setLoggedSlots(new Set(logs.map((l) => l.slot)));
        const today = habits.find((h) => h.date === todayISO());
        setWaterMl(today?.waterMl ?? 0);
        setMounted(true);
      }
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleToggle(slot: WeeklySlot, calories: number, proteinG: number, carbsG: number, fatG: number) {
    if (loggedSlots.has(slot)) {
      await unlogMeal(todayISO(), slot);
    } else {
      await logMealEaten({ slot, calories, proteinG, carbsG, fatG });
    }
    refresh();
  }

  async function addWater(ml: number) {
    const updated = Math.max(0, waterMl + ml);
    setWaterMl(updated);
    await upsertHabitLog({ waterMl: updated });
  }

  if (!mounted) {
    return <div className="h-56 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const meals = match?.day.meals ?? [];
  const completedCount = meals.filter((m) => loggedSlots.has(m.slot)).length;
  const completionPct = meals.length > 0 ? Math.round((completedCount / meals.length) * 100) : 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">
          <Utensils size={12} className="mr-1" /> Today&apos;s Meals
        </Badge>
        {meals.length > 0 && (
          <span className="text-xs text-muted">{completedCount}/{meals.length} logged ({completionPct}%)</span>
        )}
      </div>

      {meals.length === 0 ? (
        <p className="text-sm text-muted mb-4">
          No meal plan covers today — generate a 7-day plan in Nutrition to see it here.
        </p>
      ) : (
        <div className="space-y-2 mb-4">
          {meals.map((meal) => (
            <button
              key={meal.slot}
              onClick={() => handleToggle(meal.slot, meal.calories, meal.proteinG, meal.carbsG, meal.fatG)}
              className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-left transition ${
                loggedSlots.has(meal.slot) ? "border-success/40 bg-success/5" : "border-border"
              }`}
            >
              <div>
                <p className="text-sm font-medium">{WEEKLY_SLOT_LABELS[meal.slot]}</p>
                <p className="text-xs text-muted truncate">{meal.foods.map((f) => f.name).join(", ")}</p>
              </div>
              <span className="text-xs text-muted shrink-0 ml-2">{Math.round(meal.calories)} kcal</span>
            </button>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted flex items-center gap-1.5">
          <Droplet size={12} className="text-blue-400" /> Water: {(waterMl / 1000).toFixed(1)}L
        </span>
        <button
          onClick={() => addWater(250)}
          className="flex items-center gap-1 text-xs text-crimson font-medium"
        >
          <Plus size={12} /> 250ml
        </button>
      </div>
    </Card>
  );
}
