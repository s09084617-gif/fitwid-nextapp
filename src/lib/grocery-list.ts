import type { MealPlan } from "@/lib/meal-plan-generator";
import type { FoodCategory } from "@/lib/indian-foods";

export interface GroceryItem {
  name: string;
  servingDesc: string;
  count: number;
}

export interface GroceryList {
  category: FoodCategory;
  items: GroceryItem[];
}

const CATEGORY_ORDER: FoodCategory[] = [
  "grains", "legumes", "protein", "dairy", "vegetables", "fruits", "breads", "snacks",
];

/** Aggregates all foods across a meal plan's meals into a grouped grocery
 * list, scaled by the number of days the plan will be repeated. */
export function generateGroceryList(plan: MealPlan, days: number = 1): GroceryList[] {
  const counts = new Map<string, { food: (typeof plan.meals)[number]["foods"][number]; count: number }>();

  for (const meal of plan.meals) {
    for (const food of meal.foods) {
      const existing = counts.get(food.id);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(food.id, { food, count: 1 });
      }
    }
  }

  const byCategory = new Map<FoodCategory, GroceryItem[]>();
  for (const { food, count } of counts.values()) {
    const list = byCategory.get(food.category) ?? [];
    list.push({
      name: food.name,
      servingDesc: food.servingDesc,
      count: count * days,
    });
    byCategory.set(food.category, list);
  }

  return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => ({
    category,
    items: (byCategory.get(category) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

/** Same aggregation, but across a full 7-day WeeklyMealPlan — since the
 * plan already spans a real week, no day-count multiplier is needed. */
export function generateWeeklyGroceryList(
  plan: import("@/lib/meal-plan-generator").WeeklyMealPlan
): GroceryList[] {
  const counts = new Map<string, { food: (typeof plan.days)[number]["meals"][number]["foods"][number]; count: number }>();

  for (const day of plan.days) {
    for (const meal of day.meals) {
      for (const food of meal.foods) {
        const existing = counts.get(food.id);
        if (existing) existing.count += 1;
        else counts.set(food.id, { food, count: 1 });
      }
    }
  }

  const byCategory = new Map<FoodCategory, GroceryItem[]>();
  for (const { food, count } of counts.values()) {
    const list = byCategory.get(food.category) ?? [];
    list.push({ name: food.name, servingDesc: food.servingDesc, count });
    byCategory.set(food.category, list);
  }

  return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => ({
    category,
    items: (byCategory.get(category) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
  }));
}
