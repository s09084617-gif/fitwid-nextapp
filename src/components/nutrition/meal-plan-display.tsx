import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MealPlan } from "@/lib/meal-plan-generator";

export function MealPlanDisplay({
  plan,
  onSave,
  onRegenerate,
  saved,
}: {
  plan: MealPlan;
  onSave?: () => void;
  onRegenerate?: () => void;
  saved?: boolean;
}) {
  const targetPct = Math.round((plan.totals.calories / plan.targets.calories) * 100);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <Badge variant="gold" className="mb-2">
            Generated Meal Plan
          </Badge>
          <h3 className="font-display text-2xl">
            {plan.totals.calories} kcal{" "}
            <span className="text-sm text-muted font-sans">
              ({targetPct}% of {plan.targets.calories} target)
            </span>
          </h3>
          <p className="text-sm text-muted mt-1">
            P: {plan.totals.proteinG}g · C: {plan.totals.carbsG}g · F:{" "}
            {plan.totals.fatG}g
          </p>
        </div>
        {(onSave || onRegenerate) && (
          <div className="flex gap-2 shrink-0">
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                Regenerate
              </Button>
            )}
            {onSave && (
              <Button variant="gold" size="sm" onClick={onSave} disabled={saved}>
                {saved ? "Saved ✓" : "Save Plan"}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {plan.meals.map((meal) => (
          <div key={meal.slot} className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">{meal.slot}</p>
              <p className="text-xs text-muted">{meal.calories} kcal</p>
            </div>
            {meal.foods.length === 0 ? (
              <p className="text-xs text-muted">
                No matching foods for this diet preference.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {meal.foods.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground/90">
                      {f.name}{" "}
                      <span className="text-xs text-muted">
                        ({f.servingDesc})
                      </span>
                    </span>
                    <span className="text-xs text-muted shrink-0 ml-2">
                      {f.calories} kcal
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted mt-4">
        Portions are approximate. Adjust quantities to hit your exact targets
        — this is a starting structure, not a prescription.
      </p>
    </Card>
  );
}
