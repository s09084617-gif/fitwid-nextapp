"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateGroceryList } from "@/lib/grocery-list";
import type { MealPlan } from "@/lib/meal-plan-generator";

const CATEGORY_LABELS: Record<string, string> = {
  grains: "Grains",
  legumes: "Legumes / Dal",
  protein: "Protein",
  dairy: "Dairy",
  vegetables: "Vegetables",
  fruits: "Fruits",
  breads: "Breads",
  snacks: "Snacks / Nuts",
};

const DAY_OPTIONS = [1, 3, 7];

export function GroceryList({ plan }: { plan: MealPlan }) {
  const [days, setDays] = useState(1);
  const list = generateGroceryList(plan, days);

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="success">
          <ShoppingCart size={12} className="mr-1" /> Grocery List
        </Badge>
        <div className="flex gap-1.5">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                days === d
                  ? "border-crimson bg-crimson/15 text-crimson"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {d} day{d > 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-muted mb-4">
        Based on repeating this exact meal plan for {days} day{days > 1 ? "s" : ""}.
      </p>

      {list.length === 0 ? (
        <p className="text-sm text-muted">No items to list.</p>
      ) : (
        <div className="space-y-4">
          {list.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold mb-2">
                {CATEGORY_LABELS[group.category] ?? group.category}
              </p>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-foreground/90">{item.name}</span>
                    <span className="text-xs text-muted shrink-0 ml-2">
                      {item.count}× {item.servingDesc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
