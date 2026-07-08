"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSavedMealPlans, deleteMealPlan } from "@/lib/db/user-data";
import type { MealPlan } from "@/lib/meal-plan-generator";
import { cn } from "@/lib/utils";

export function SavedMealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function refresh() {
      getSavedMealPlans().then((list) => {
        setPlans(list);
        setMounted(true);
      });
    }
    refresh();
    window.addEventListener("fitwid:mealplans-updated", refresh);
    return () =>
      window.removeEventListener("fitwid:mealplans-updated", refresh);
  }, []);

  function handleDelete(id: string) {
    deleteMealPlan(id).then(setPlans);
  }

  if (!mounted) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">Saved Meal Plans</Badge>
        <span className="text-xs text-muted">{plans.length} saved</span>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted">
          No saved meal plans yet — generate one above and hit &ldquo;Save
          Plan&rdquo;.
        </p>
      ) : (
        <div className="space-y-2">
          {plans.map((p) => {
            const isOpen = openId === p.id;
            return (
              <div
                key={p.id}
                className="rounded-md border border-border overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : p.id)}
                    className="flex-1 flex items-center justify-between text-left min-w-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {p.totals.calories} kcal · {p.dietTag}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        · {p.meals.length} meals
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "shrink-0 text-muted transition-transform ml-2",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="shrink-0 text-muted hover:text-danger transition p-1"
                    aria-label="Delete meal plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t border-border px-4 py-3 space-y-3 bg-surface-2/50">
                    {p.meals.map((m) => (
                      <div key={m.slot}>
                        <p className="text-xs font-semibold text-gold mb-1">
                          {m.slot} ({m.calories} kcal)
                        </p>
                        {m.foods.map((f) => (
                          <p key={f.id} className="text-xs text-muted pl-2">
                            · {f.name}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
