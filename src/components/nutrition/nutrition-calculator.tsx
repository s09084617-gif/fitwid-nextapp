"use client";

import { useState } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { calculateNutritionTargets, calculateWaterIntakeLiters, type MacroTargets } from "@/lib/nutrition";
import type { Gender, ActivityLevel, Goal } from "@/lib/assessment";
import type { DietTag } from "@/lib/indian-foods";

const DIET_OPTIONS: { value: DietTag; label: string }[] = [
  { value: "veg", label: "Vegetarian" },
  { value: "egg", label: "Eggetarian" },
  { value: "nonveg", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
];

export function NutritionCalculator({
  onCalculated,
}: {
  onCalculated: (targets: MacroTargets, dietTag: DietTag) => void;
}) {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("fat_loss");
  const [dietTag, setDietTag] = useState<DietTag>("veg");
  const [targets, setTargets] = useState<MacroTargets | null>(null);
  const [waterLiters, setWaterLiters] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate() {
    const ageNum = Number(age);
    const heightNum = Number(heightCm);
    const weightNum = Number(weightKg);
    if (!ageNum || !heightNum || !weightNum) {
      setError("Please fill in age, height, and weight.");
      return;
    }
    setError(null);
    const result = calculateNutritionTargets({
      gender,
      age: ageNum,
      heightCm: heightNum,
      weightKg: weightNum,
      activityLevel,
      goal,
    });
    setTargets(result);
    setWaterLiters(calculateWaterIntakeLiters(weightNum, activityLevel));
    onCalculated(result, dietTag);
  }

  return (
    <Card>
      <Badge variant="crimson" className="mb-4">
        Calorie & Macro Calculator
      </Badge>
      <div className="space-y-6">
        <ToggleGroup
          label="Gender"
          value={gender}
          onChange={setGender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="Age" type="number" placeholder="28" value={age} onChange={(e) => setAge(e.target.value)} />
          <Input label="Height (cm)" type="number" placeholder="175" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          <Input label="Weight (kg)" type="number" placeholder="78" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </div>

        <Select
          label="Activity Level"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
        >
          <option value="sedentary">Sedentary (little to no exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="very_active">Very Active (physical job + training)</option>
        </Select>

        <ToggleGroup
          label="Goal"
          value={goal}
          onChange={setGoal}
          options={[
            { value: "fat_loss", label: "Fat Loss" },
            { value: "muscle_gain", label: "Muscle Gain" },
            { value: "maintain", label: "Maintain" },
          ]}
        />

        <ToggleGroup
          label="Diet Preference"
          value={dietTag}
          onChange={setDietTag}
          options={DIET_OPTIONS}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button size="lg" className="w-full" onClick={handleCalculate}>
          Calculate My Targets
        </Button>
      </div>

      {targets && (
        <div className="grid sm:grid-cols-5 gap-4 mt-6 pt-6 border-t border-border">
          <div>
            <CardTitle className="text-gold">{targets.calories}</CardTitle>
            <CardDescription>kcal / day</CardDescription>
          </div>
          <div>
            <CardTitle>{targets.proteinG}g</CardTitle>
            <CardDescription>Protein</CardDescription>
          </div>
          <div>
            <CardTitle>{targets.carbsG}g</CardTitle>
            <CardDescription>Carbs</CardDescription>
          </div>
          <div>
            <CardTitle>{targets.fatG}g</CardTitle>
            <CardDescription>Fat</CardDescription>
          </div>
          <div>
            <CardTitle className="text-success">{waterLiters}L</CardTitle>
            <CardDescription>Water / day</CardDescription>
          </div>
        </div>
      )}
    </Card>
  );
}
