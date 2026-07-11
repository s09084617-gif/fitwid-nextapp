"use client";

import { useEffect, useState } from "react";
import { Sparkles, ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { WeeklyPlanView } from "@/components/nutrition/weekly-plan-view";
import { WeeklyGroceryList } from "@/components/nutrition/weekly-grocery-list";
import {
  generateWeeklyMealPlan,
  swapWeeklyMeal,
  type WeeklyMealPlan,
  type WeeklySlot,
  type BudgetTier,
} from "@/lib/meal-plan-generator";
import { calculateNutritionTargets, calculateWaterIntakeLiters } from "@/lib/nutrition";
import {
  getMyProfileSnapshot,
  saveWeeklyMealPlan,
  getNutritionLogsForDate,
  type ProfileSnapshot,
} from "@/lib/db/user-data";
import type { DietTag } from "@/lib/indian-foods";
import type { Gender, ActivityLevel, Goal } from "@/lib/assessment";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function WeeklyPlannerForm() {
  const [dietTag, setDietTag] = useState<DietTag>("veg");
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("medium");
  const [goal, setGoal] = useState<Goal>("fat_loss");
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [usingProfile, setUsingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [plan, setPlan] = useState<WeeklyMealPlan | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGrocery, setShowGrocery] = useState(false);
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set());
  const [waterLiters, setWaterLiters] = useState<number | null>(null);

  useEffect(() => {
    getMyProfileSnapshot().then((p) => {
      setProfile(p);
      setMounted(true);
    });
    refreshLogs();
  }, []);

  function refreshLogs() {
    getNutritionLogsForDate(todayISO()).then((logs) => {
      setLoggedDates(new Set(logs.map((l) => `${l.logDate}::${l.slot}`)));
    });
  }

  function applyProfile() {
    if (!profile) return;
    setGoal(profile.goal as Goal);
    setUsingProfile(true);
  }

  function handleGenerate() {
    let targets;
    if (profile) {
      targets = calculateNutritionTargets({
        gender: profile.gender as Gender,
        age: profile.age,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        activityLevel: profile.activityLevel as ActivityLevel,
        goal,
      });
      setWaterLiters(calculateWaterIntakeLiters(profile.weightKg, profile.activityLevel as ActivityLevel));
    } else {
      // Sensible generic defaults if no assessment exists yet.
      targets = calculateNutritionTargets({
        gender: "male", age: 28, heightCm: 175, weightKg: 75, activityLevel: "moderate", goal,
      });
      setWaterLiters(3);
    }

    const newPlan = generateWeeklyMealPlan(targets, dietTag, budgetTier, goal, profile?.workoutDaysPerWeek ?? 4);
    setPlan(newPlan);
    setPlanId(null);
    setSaved(false);
    setShowGrocery(false);
  }

  async function handleSave() {
    if (!plan) return;
    setSaving(true);
    const id = await saveWeeklyMealPlan(plan);
    setPlanId(id);
    setSaved(true);
    setSaving(false);
  }

  function handleSwapMeal(dayNumber: number, slot: WeeklySlot) {
    if (!plan) return;
    setPlan(swapWeeklyMeal(plan, dayNumber, slot));
  }

  return (
    <div className="space-y-6">
      {mounted && profile && !usingProfile && (
        <Card className="border-gold/40 bg-gold/5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
              <ClipboardCheck size={16} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Use your Body Assessment data?</p>
              <p className="text-xs text-muted mb-3">
                We&apos;ll calculate your calorie and macro targets from your
                real height, weight, age, and goal instead of generic
                defaults.
              </p>
              <Button size="sm" variant="gold" onClick={applyProfile}>
                <Sparkles size={14} /> Apply My Assessment Data
              </Button>
            </div>
          </div>
        </Card>
      )}
      {mounted && !profile && (
        <Card>
          <p className="text-sm text-muted">
            You haven&apos;t taken a Body Assessment yet — targets below use
            generic defaults. Take an assessment for accurate numbers.
          </p>
        </Card>
      )}
      {usingProfile && <Badge variant="gold">Using your Body Assessment data</Badge>}

      <Card>
        <div className="space-y-6">
          <ToggleGroup
            label="Goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "fat_loss", label: "Fat Loss" },
              { value: "muscle_gain", label: "Muscle Gain" },
              { value: "body_recomposition", label: "Body Recomp" },
              { value: "strength", label: "Strength" },
              { value: "athletic_performance", label: "Athletic Perf." },
            ]}
          />
          <ToggleGroup
            label="Diet Preference"
            value={dietTag}
            onChange={setDietTag}
            options={[
              { value: "veg", label: "Vegetarian" },
              { value: "egg", label: "Eggetarian" },
              { value: "nonveg", label: "Non-Veg" },
              { value: "vegan", label: "Vegan" },
            ]}
          />
          <ToggleGroup
            label="Budget"
            value={budgetTier}
            onChange={setBudgetTier}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
          <Button size="lg" className="w-full" onClick={handleGenerate}>
            Generate 7-Day Meal Plan
          </Button>
        </div>
      </Card>

      {plan && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Card lift={false} className="text-center py-4">
              <p className="font-display text-xl text-gold">{plan.targets.calories}</p>
              <p className="text-[11px] text-muted">kcal/day</p>
            </Card>
            <Card lift={false} className="text-center py-4">
              <p className="font-display text-xl">{plan.targets.proteinG}g</p>
              <p className="text-[11px] text-muted">Protein</p>
            </Card>
            <Card lift={false} className="text-center py-4">
              <p className="font-display text-xl">{plan.targets.carbsG}g</p>
              <p className="text-[11px] text-muted">Carbs</p>
            </Card>
            <Card lift={false} className="text-center py-4">
              <p className="font-display text-xl">{plan.targets.fatG}g</p>
              <p className="text-[11px] text-muted">Fat</p>
            </Card>
            <Card lift={false} className="text-center py-4">
              <p className="font-display text-xl text-success">{waterLiters}L</p>
              <p className="text-[11px] text-muted">Water/day</p>
            </Card>
          </div>

          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={handleGenerate} className="flex-1">
              Regenerate
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={saving || saved} className="flex-1">
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save Plan"}
            </Button>
          </div>

          <WeeklyPlanView
            plan={plan}
            planId={planId}
            onSwapMeal={handleSwapMeal}
            onShowGroceryList={() => setShowGrocery((v) => !v)}
            loggedDates={loggedDates}
            onRefreshLogs={refreshLogs}
          />

          {showGrocery && <WeeklyGroceryList plan={plan} planId={planId} />}
        </>
      )}
    </div>
  );
}
