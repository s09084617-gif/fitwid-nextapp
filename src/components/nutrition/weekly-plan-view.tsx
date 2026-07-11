"use client";

import { useState } from "react";
import { Calendar, Printer, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MealCard } from "@/components/nutrition/meal-card";
import { logMealEaten, unlogMeal, toggleFavoriteMeal } from "@/lib/db/user-data";
import type { WeeklyMealPlan, WeeklySlot } from "@/lib/meal-plan-generator";
import { cn } from "@/lib/utils";

function dateForDay(createdAt: string, dayNumber: number) {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + (dayNumber - 1));
  return d.toISOString().slice(0, 10);
}

export function WeeklyPlanView({
  plan,
  planId,
  onSwapMeal,
  onShowGroceryList,
  loggedDates,
  onRefreshLogs,
}: {
  plan: WeeklyMealPlan;
  planId: string | null;
  onSwapMeal: (dayNumber: number, slot: WeeklySlot) => void;
  onShowGroceryList: () => void;
  loggedDates: Set<string>; // "date::slot" keys
  onRefreshLogs: () => void;
}) {
  const [activeDay, setActiveDay] = useState(1);
  const day = plan.days.find((d) => d.dayNumber === activeDay);

  function handlePrint() {
    window.print();
  }

  async function handleToggleLogged(slot: WeeklySlot, calories: number, proteinG: number, carbsG: number, fatG: number) {
    const date = dateForDay(plan.createdAt, activeDay);
    const key = `${date}::${slot}`;
    if (loggedDates.has(key)) {
      await unlogMeal(date, slot);
    } else {
      await logMealEaten({ mealPlanId: planId ?? undefined, slot, calories, proteinG, carbsG, fatG, logDate: date });
    }
    onRefreshLogs();
  }

  async function handleToggleFavorite(slot: WeeklySlot) {
    if (!planId) return;
    const isFav = day?.meals.find((m) => m.slot === slot)?.isFavorite ?? false;
    await toggleFavoriteMeal(planId, activeDay, slot, !isFav);
    onRefreshLogs();
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-crimson" />
            <Badge variant="crimson">{plan.title}</Badge>
          </div>
          <div className="flex gap-2 print:hidden">
            <button onClick={onShowGroceryList} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-crimson/50 transition flex items-center gap-1.5">
              <Download size={12} /> Grocery List
            </button>
            <button onClick={handlePrint} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground hover:border-crimson/50 transition flex items-center gap-1.5">
              <Printer size={12} /> Print / PDF
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          {plan.days.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setActiveDay(d.dayNumber)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm font-medium transition min-w-[70px]",
                activeDay === d.dayNumber
                  ? "border-crimson bg-crimson/15 text-crimson"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              Day {d.dayNumber}
              {d.isTrainingDay && <span className="block text-[10px] opacity-75">Training</span>}
            </button>
          ))}
        </div>
      </Card>

      {day && (
        <div className="space-y-3">
          {day.meals.map((meal) => {
            const date = dateForDay(plan.createdAt, activeDay);
            const isLogged = loggedDates.has(`${date}::${meal.slot}`);
            return (
              <MealCard
                key={meal.slot}
                meal={meal}
                isLogged={isLogged}
                onSwap={() => onSwapMeal(activeDay, meal.slot)}
                onToggleFavorite={planId ? () => handleToggleFavorite(meal.slot) : undefined}
                onToggleLogged={() => handleToggleLogged(meal.slot, meal.calories, meal.proteinG, meal.carbsG, meal.fatG)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
