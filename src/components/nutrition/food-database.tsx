"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INDIAN_FOODS, type FoodCategory } from "@/lib/indian-foods";

const CATEGORY_LABELS: Record<FoodCategory | "all", string> = {
  all: "All",
  grains: "Grains",
  legumes: "Legumes / Dal",
  protein: "Protein",
  dairy: "Dairy",
  vegetables: "Vegetables",
  fruits: "Fruits",
  snacks: "Snacks / Nuts",
  breads: "Breads",
};

export function FoodDatabase() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");

  const filtered = useMemo(() => {
    return INDIAN_FOODS.filter((f) => {
      const matchesCategory = category === "all" || f.category === category;
      const matchesQuery = f.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <Card>
      <Badge variant="success" className="mb-4">
        Indian Food Database ({INDIAN_FOODS.length} items)
      </Badge>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search foods..."
            className="w-full rounded-md border border-border bg-surface pl-9 pr-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(CATEGORY_LABELS) as (FoodCategory | "all")[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                category === cat
                  ? "border-crimson bg-crimson/15 text-crimson"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        )}
      </div>

      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="px-2 py-2 font-medium">Food</th>
              <th className="px-2 py-2 font-medium">Serving</th>
              <th className="px-2 py-2 font-medium text-right">kcal</th>
              <th className="px-2 py-2 font-medium text-right">P</th>
              <th className="px-2 py-2 font-medium text-right">C</th>
              <th className="px-2 py-2 font-medium text-right">F</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-border/50">
                <td className="px-2 py-2">{f.name}</td>
                <td className="px-2 py-2 text-muted text-xs">
                  {f.servingDesc}
                </td>
                <td className="px-2 py-2 text-right">{f.calories}</td>
                <td className="px-2 py-2 text-right text-xs">
                  {f.proteinG}g
                </td>
                <td className="px-2 py-2 text-right text-xs">{f.carbsG}g</td>
                <td className="px-2 py-2 text-right text-xs">{f.fatG}g</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-6">
            No foods match your search.
          </p>
        )}
      </div>
    </Card>
  );
}
