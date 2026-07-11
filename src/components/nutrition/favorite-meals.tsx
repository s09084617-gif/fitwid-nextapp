"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFavoriteMeals, type FavoriteMeal } from "@/lib/db/user-data";
import { WEEKLY_SLOT_LABELS } from "@/lib/meal-plan-generator";

export function FavoriteMeals() {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getFavoriteMeals().then((f) => {
      setFavorites(f);
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">
          <Star size={12} className="mr-1 fill-gold" /> Favorite Meals
        </Badge>
        <span className="text-xs text-muted">{favorites.length} saved</span>
      </div>
      {favorites.length === 0 ? (
        <p className="text-sm text-muted">
          No favorite meals yet — star any meal in a generated plan to pin it here.
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((f, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="crimson">{WEEKLY_SLOT_LABELS[f.slot]}</Badge>
                <span className="text-xs text-muted">{Math.round(f.calories)} kcal</span>
              </div>
              <p className="text-sm text-foreground/90">{f.foods.map((food) => food.name).join(", ")}</p>
              <p className="text-[11px] text-muted mt-1">From {f.planTitle} · Day {f.dayNumber}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
