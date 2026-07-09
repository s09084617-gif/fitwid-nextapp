"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { MultiToggleGroup } from "@/components/ui/multi-toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FullAssessmentResults } from "@/components/assessment/full-results";
import {
  runAssessment,
  type AssessmentInput,
  type AssessmentResult,
  type Gender,
  type Goal,
  type ActivityLevel,
  type StressLevel,
} from "@/lib/assessment";
import { generateWorkout, type WorkoutPlan, type Goal as WorkoutGoal } from "@/lib/workout-generator";
import { generateMealPlan, type MealPlan } from "@/lib/meal-plan-generator";
import type { Difficulty, Equipment } from "@/lib/workout-data";
import type { DietTag } from "@/lib/indian-foods";
import { saveLastAssessment } from "@/lib/db/user-data";
import { trackEvent } from "@/lib/analytics/events";

const MEDICAL_OPTIONS = [
  "None",
  "Diabetes",
  "High Blood Pressure",
  "Heart Condition",
  "Joint/Back Issues",
  "Pregnant",
  "Other",
];

const defaultForm = {
  gender: "male" as Gender,
  age: "",
  heightCm: "",
  weightKg: "",
  activityLevel: "moderate" as ActivityLevel,
  goal: "fat_loss" as Goal,
  experience: "beginner" as Difficulty,
  equipment: ["bodyweight"] as Equipment[],
  dietTag: "veg" as DietTag,
  sleepHours: "7",
  stressLevel: "medium" as StressLevel,
  medicalConditions: [] as string[],
  waistCm: "",
  neckCm: "",
  hipCm: "",
};

function mapToWorkoutGoal(goal: Goal): WorkoutGoal {
  if (goal === "fat_loss") return "fat_loss";
  if (goal === "muscle_gain") return "muscle_gain";
  return "muscle_gain"; // "maintain" defaults to a balanced hypertrophy scheme
}

export function AssessmentForm() {
  const [form, setForm] = useState(defaultForm);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof defaultForm>(
    key: K,
    value: (typeof defaultForm)[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleMedical(condition: string) {
    setForm((f) => {
      if (condition === "None") {
        return { ...f, medicalConditions: ["None"] };
      }
      const withoutNone = f.medicalConditions.filter((c) => c !== "None");
      const has = withoutNone.includes(condition);
      return {
        ...f,
        medicalConditions: has
          ? withoutNone.filter((c) => c !== condition)
          : [...withoutNone, condition],
      };
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const age = Number(form.age);
    const heightCm = Number(form.heightCm);
    const weightKg = Number(form.weightKg);

    if (!age || !heightCm || !weightKg) {
      setError("Please fill in age, height, and weight.");
      return;
    }
    if (age < 13 || age > 100) {
      setError("Age must be between 13 and 100.");
      return;
    }
    if (heightCm < 100 || heightCm > 250) {
      setError("Height must be between 100cm and 250cm.");
      return;
    }
    if (weightKg < 30 || weightKg > 300) {
      setError("Weight must be between 30kg and 300kg.");
      return;
    }
    if (form.equipment.length === 0) {
      setError("Select at least one equipment option.");
      return;
    }

    const input: AssessmentInput = {
      gender: form.gender,
      age,
      heightCm,
      weightKg,
      activityLevel: form.activityLevel,
      goal: form.goal,
      waistCm: form.waistCm ? Number(form.waistCm) : undefined,
      neckCm: form.neckCm ? Number(form.neckCm) : undefined,
      hipCm: form.hipCm ? Number(form.hipCm) : undefined,
      sleepHours: form.sleepHours ? Number(form.sleepHours) : undefined,
      stressLevel: form.stressLevel,
      medicalConditions: form.medicalConditions,
    };

    const calculated = runAssessment(input);
    saveLastAssessment(calculated, weightKg);
    trackEvent("assessment_completed", { goal: form.goal });

    const workoutPlan = generateWorkout({
      goal: mapToWorkoutGoal(form.goal),
      experience: form.experience,
      equipment: form.equipment,
      focus: "full_body",
    });

    const plan = generateMealPlan(
      {
        calories: calculated.macros.calories,
        proteinG: calculated.macros.proteinG,
        carbsG: calculated.macros.carbsG,
        fatG: calculated.macros.fatG,
        proteinPerKg: calculated.macros.proteinPerKg,
      },
      form.dietTag
    );

    setResult(calculated);
    setWorkout(workoutPlan);
    setMealPlan(plan);
  }

  function handleRetake() {
    setResult(null);
    setWorkout(null);
    setMealPlan(null);
  }

  if (result && workout && mealPlan) {
    return (
      <FullAssessmentResults
        result={result}
        workout={workout}
        mealPlan={mealPlan}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal info */}
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">
            Personal Info
          </p>
          <ToggleGroup
            label="Gender"
            value={form.gender}
            onChange={(v) => update("gender", v)}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Age" type="number" placeholder="28" value={form.age} onChange={(e) => update("age", e.target.value)} />
            <Input label="Height (cm)" type="number" placeholder="175" value={form.heightCm} onChange={(e) => update("heightCm", e.target.value)} />
            <Input label="Weight (kg)" type="number" placeholder="78" value={form.weightKg} onChange={(e) => update("weightKg", e.target.value)} />
          </div>
        </div>

        {/* Goals & training */}
        <div className="space-y-6 pt-2 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold pt-4">
            Goals & Training
          </p>
          <ToggleGroup
            label="Primary Goal"
            value={form.goal}
            onChange={(v) => update("goal", v)}
            options={[
              { value: "fat_loss", label: "Fat Loss" },
              { value: "muscle_gain", label: "Muscle Gain" },
              { value: "maintain", label: "Maintain" },
            ]}
          />
          <ToggleGroup
            label="Training Experience"
            value={form.experience}
            onChange={(v) => update("experience", v)}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
          <Select
            label="Activity Level"
            value={form.activityLevel}
            onChange={(e) => update("activityLevel", e.target.value as ActivityLevel)}
          >
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5 days/week)</option>
            <option value="active">Active (6–7 days/week)</option>
            <option value="very_active">Very Active (physical job + training)</option>
          </Select>
          <MultiToggleGroup
            label="Equipment Access"
            values={form.equipment}
            onChange={(v) => update("equipment", v)}
            options={[
              { value: "bodyweight", label: "Bodyweight" },
              { value: "dumbbell", label: "Dumbbells" },
              { value: "barbell", label: "Barbell" },
              { value: "machine", label: "Machines" },
              { value: "bands", label: "Bands" },
              { value: "kettlebell", label: "Kettlebell" },
            ]}
          />
        </div>

        {/* Lifestyle */}
        <div className="space-y-6 pt-2 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold pt-4">
            Lifestyle & Nutrition
          </p>
          <ToggleGroup
            label="Food Preference"
            value={form.dietTag}
            onChange={(v) => update("dietTag", v)}
            options={[
              { value: "veg", label: "Vegetarian" },
              { value: "egg", label: "Eggetarian" },
              { value: "nonveg", label: "Non-Veg" },
              { value: "vegan", label: "Vegan" },
            ]}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Average Sleep (hours/night)"
              type="number"
              placeholder="7"
              value={form.sleepHours}
              onChange={(e) => update("sleepHours", e.target.value)}
            />
            <div className="flex flex-col gap-1.5">
              <ToggleGroup
                label="Stress Level"
                value={form.stressLevel}
                onChange={(v) => update("stressLevel", v)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="space-y-3 pt-2 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold pt-4">
            Health
          </p>
          <MultiToggleGroup
            label="Medical Conditions (select any that apply)"
            values={form.medicalConditions}
            onChange={(v) => {
              // Route through toggleMedical so "None" stays exclusive
              const added = v.find((x) => !form.medicalConditions.includes(x));
              if (added) toggleMedical(added);
              else {
                const removed = form.medicalConditions.find((x) => !v.includes(x));
                if (removed) toggleMedical(removed);
              }
            }}
            options={MEDICAL_OPTIONS.map((m) => ({ value: m, label: m }))}
          />
          <p className="text-[11px] text-muted">
            This isn&apos;t a medical diagnosis. If you note a condition,
            we&apos;ll flag that you should get clearance from a doctor —
            we won&apos;t attempt to modify your plan for it ourselves.
          </p>
        </div>

        {/* Advanced body fat measurements */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-sm text-crimson font-medium pt-4"
          >
            {showAdvanced ? "− Hide" : "+ Add"} measurements for a more
            accurate body fat estimate
          </button>
          {showAdvanced && (
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <Input label="Waist (cm)" type="number" placeholder="86" value={form.waistCm} onChange={(e) => update("waistCm", e.target.value)} />
              <Input label="Neck (cm)" type="number" placeholder="38" value={form.neckCm} onChange={(e) => update("neckCm", e.target.value)} />
              {form.gender === "female" && (
                <Input label="Hip (cm)" type="number" placeholder="96" value={form.hipCm} onChange={(e) => update("hipCm", e.target.value)} />
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full">
          Generate My AI Body Assessment
        </Button>
      </form>
    </Card>
  );
}
