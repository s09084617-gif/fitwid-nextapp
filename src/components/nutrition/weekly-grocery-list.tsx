"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateWeeklyGroceryList } from "@/lib/grocery-list";
import { saveGroceryList } from "@/lib/db/user-data";
import type { WeeklyMealPlan } from "@/lib/meal-plan-generator";

const CATEGORY_LABELS: Record<string, string> = {
  grains: "Grains", legumes: "Legumes / Dal", protein: "Protein", dairy: "Dairy",
  vegetables: "Vegetables", fruits: "Fruits", breads: "Breads", snacks: "Snacks / Nuts",
};

export function WeeklyGroceryList({ plan, planId }: { plan: WeeklyMealPlan; planId: string | null }) {
  const list = generateWeeklyGroceryList(plan);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!planId) return;
    await saveGroceryList(planId, list);
    setSaved(true);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Badge variant="success">
          <ShoppingCart size={12} className="mr-1" /> 7-Day Grocery List
        </Badge>
        {planId && (
          <Button size="sm" variant="outline" onClick={handleSave} disabled={saved}>
            <Check size={12} /> {saved ? "Saved ✓" : "Save List"}
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {list.map((group) => (
          <div key={group.category}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-2">
              {CATEGORY_LABELS[group.category] ?? group.category}
            </p>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/90">{item.name}</span>
                  <span className="text-xs text-muted shrink-0 ml-2">{item.count}× {item.servingDesc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted">No items to list.</p>}
      </div>
    </Card>
  );
}
