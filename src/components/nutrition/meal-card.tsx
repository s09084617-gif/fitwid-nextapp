"use client";

import { useState } from "react";
import { RefreshCw, Star, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WEEKLY_SLOT_LABELS, WEEKLY_MEAL_TIMING, type WeeklyMealPlanItem } from "@/lib/meal-plan-generator";
import { cn } from "@/lib/utils";

export function MealCard({
  meal,
  isLogged,
  onSwap,
  onToggleFavorite,
  onToggleLogged,
}: {
  meal: WeeklyMealPlanItem;
  isLogged?: boolean;
  onSwap?: () => void;
  onToggleFavorite?: () => void;
  onToggleLogged?: () => void;
}) {
  const [swapping, setSwapping] = useState(false);

  async function handleSwap() {
    if (!onSwap) return;
    setSwapping(true);
    onSwap();
    setTimeout(() => setSwapping(false), 300);
  }

  return (
    <div className={cn(
      "rounded-lg border p-4 print:break-inside-avoid transition-colors",
      isLogged ? "border-success/40 bg-success/5" : "border-border"
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <Badge variant="crimson">{WEEKLY_SLOT_LABELS[meal.slot]}</Badge>
          <p className="text-[11px] text-muted flex items-center gap-1 mt-1.5">
            <Clock size={10} /> {WEEKLY_MEAL_TIMING[meal.slot]}
          </p>
        </div>
        <div className="flex items-center gap-1.5 print:hidden">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="text-muted hover:text-gold p-1"
              aria-label={meal.isFavorite ? "Remove favorite" : "Add favorite"}
            >
              <Star size={14} className={meal.isFavorite ? "fill-gold text-gold" : ""} />
            </button>
          )}
          {onSwap && (
            <button
              type="button"
              onClick={handleSwap}
              className="text-muted hover:text-foreground p-1"
              aria-label="Swap this meal"
            >
              <RefreshCw size={14} className={swapping ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-1.5 mb-3">
        {meal.foods.map((f) => (
          <li key={f.id} className="flex items-center justify-between text-sm">
            <span className="text-foreground/90">{f.name}</span>
            <span className="text-xs text-muted shrink-0 ml-2">{f.servingDesc}</span>
          </li>
        ))}
        {meal.foods.length === 0 && (
          <li className="text-xs text-muted">No foods matched — try a different budget tier.</li>
        )}
      </ul>

      <div className="grid grid-cols-4 gap-2 text-center bg-surface-2 rounded-md p-2 mb-3">
        <div><p className="text-sm font-semibold">{Math.round(meal.calories)}</p><p className="text-[10px] text-muted">kcal</p></div>
        <div><p className="text-sm font-semibold">{Math.round(meal.proteinG)}g</p><p className="text-[10px] text-muted">Protein</p></div>
        <div><p className="text-sm font-semibold">{Math.round(meal.carbsG)}g</p><p className="text-[10px] text-muted">Carbs</p></div>
        <div><p className="text-sm font-semibold">{Math.round(meal.fatG)}g</p><p className="text-[10px] text-muted">Fat</p></div>
      </div>

      {onToggleLogged && (
        <button
          type="button"
          onClick={onToggleLogged}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition print:hidden",
            isLogged
              ? "border-success bg-success/15 text-success"
              : "border-border text-muted hover:text-foreground"
          )}
        >
          <Check size={12} /> {isLogged ? "Marked as Eaten" : "Mark as Eaten"}
        </button>
      )}
    </div>
  );
}
