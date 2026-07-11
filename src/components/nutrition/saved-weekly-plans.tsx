"use client";

import { useEffect, useState } from "react";
import { Trash2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSavedWeeklyMealPlans, deleteWeeklyMealPlan, type SavedWeeklyMealPlan } from "@/lib/db/user-data";
import { cn } from "@/lib/utils";

export function SavedWeeklyPlans() {
  const [plans, setPlans] = useState<SavedWeeklyMealPlan[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  function refresh() {
    getSavedWeeklyMealPlans().then((p) => {
      setPlans(p);
      setMounted(true);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleDelete(id: string) {
    await deleteWeeklyMealPlan(id);
    refresh();
  }

  if (!mounted) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">Saved 7-Day Plans</Badge>
        <span className="text-xs text-muted">{plans.length} saved</span>
      </div>
      {plans.length === 0 ? (
        <p className="text-sm text-muted">
          No saved plans yet — generate one above and hit &ldquo;Save Plan&rdquo;.
        </p>
      ) : (
        <div className="space-y-2">
          {plans.map((p) => {
            const isOpen = openId === p.id;
            return (
              <div key={p.id} className="rounded-md border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3">
                  <button
                    onClick={() => setOpenId(isOpen ? null : p.id)}
                    className="flex-1 flex items-center justify-between text-left min-w-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" · "}{p.targets.calories} kcal/day · {p.budgetTier} budget
                      </p>
                    </div>
                    <ChevronDown size={16} className={cn("shrink-0 text-muted transition-transform ml-2", isOpen && "rotate-180")} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="shrink-0 text-muted hover:text-danger p-1" aria-label="Delete plan">
                    <Trash2 size={16} />
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t border-border px-4 py-3 bg-surface-2/50 space-y-3">
                    {p.days.map((day) => (
                      <div key={day.dayNumber}>
                        <p className="text-xs font-semibold text-gold mb-1">Day {day.dayNumber}{day.isTrainingDay ? " (Training)" : ""}</p>
                        {day.meals.map((m) => (
                          <p key={m.slot} className="text-xs text-muted">
                            {m.slot}: {m.foods.map((f) => f.name).join(", ")} — {Math.round(m.calories)} kcal
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
