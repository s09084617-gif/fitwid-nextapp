"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getNutritionLogsForDate,
  getMyProfileSnapshot,
  todayISO,
} from "@/lib/db/user-data";
import { calculateNutritionTargets } from "@/lib/nutrition";
import type { Gender, ActivityLevel, Goal } from "@/lib/assessment";

export function CaloriesCard() {
  const [consumed, setConsumed] = useState({ calories: 0, proteinG: 0, carbsG: 0, fatG: 0 });
  const [target, setTarget] = useState({ calories: 2000, proteinG: 150, carbsG: 200, fatG: 60 });
  const [hasTarget, setHasTarget] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.all([getNutritionLogsForDate(todayISO()), getMyProfileSnapshot()]).then(
      ([logs, profile]) => {
        const totals = logs.reduce(
          (acc, l) => ({
            calories: acc.calories + l.calories,
            proteinG: acc.proteinG + l.proteinG,
            carbsG: acc.carbsG + l.carbsG,
            fatG: acc.fatG + l.fatG,
          }),
          { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
        );
        setConsumed(totals);

        if (profile) {
          const t = calculateNutritionTargets({
            gender: profile.gender as Gender,
            age: profile.age,
            heightCm: profile.heightCm,
            weightKg: profile.weightKg,
            activityLevel: profile.activityLevel as ActivityLevel,
            goal: profile.goal as Goal,
          });
          setTarget(t);
          setHasTarget(true);
        }
        setMounted(true);
      }
    );
  }, []);

  if (!mounted) {
    return <div className="h-64 rounded-lg bg-surface-2 animate-pulse" />;
  }

  const pct = Math.min(100, Math.round((consumed.calories / target.calories) * 100));
  const circumference = 2 * Math.PI * 46;
  const offset = circumference * (1 - pct / 100);
  const macros = [
    { label: "Protein", grams: consumed.proteinG, target: target.proteinG, color: "bg-crimson" },
    { label: "Carbs", grams: consumed.carbsG, target: target.carbsG, color: "bg-gold" },
    { label: "Fat", grams: consumed.fatG, target: target.fatG, color: "bg-success" },
  ];

  return (
    <Card>
      <Badge variant="crimson" className="mb-4">
        Today&apos;s Calories
      </Badge>
      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="46" fill="none" stroke="var(--crimson)" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl">{pct}%</span>
          </div>
        </div>
        <div>
          <p className="font-display text-2xl text-gold">
            {Math.round(consumed.calories).toLocaleString()}{" "}
            <span className="text-sm text-muted font-sans">/ {target.calories.toLocaleString()} kcal</span>
          </p>
          <p className="text-xs text-muted mt-1">
            {Math.max(0, Math.round(target.calories - consumed.calories))} kcal remaining today
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {macros.map((m) => {
          const macroPct = Math.min(100, Math.round((m.grams / m.target) * 100));
          return (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{m.label}</span>
                <span className="text-muted">{Math.round(m.grams)}g / {m.target}g</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className={`h-full rounded-full ${m.color}`} style={{ width: `${macroPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {!hasTarget && (
        <p className="text-[11px] text-muted mt-4">
          Take a Body Assessment to set real calorie/macro targets — showing
          generic defaults for now.
        </p>
      )}
    </Card>
  );
}
