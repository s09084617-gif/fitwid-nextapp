"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { MultiToggleGroup } from "@/components/ui/multi-toggle-group";
import { WorkoutPlanDisplay } from "@/components/workout/workout-plan-display";
import { saveWorkout } from "@/lib/db/user-data";
import { getCustomExercises } from "@/lib/db/shared-data";
import {
  generateWorkout,
  type Goal,
  type Focus,
  type WorkoutPlan,
  MUSCLE_GROUPS_SMALL_TO_BIG,
  MUSCLE_GROUP_LABELS,
} from "@/lib/workout-generator";
import type { Difficulty, Equipment, MuscleGroup } from "@/lib/workout-data";

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: "bodyweight", label: "Bodyweight" },
  { value: "dumbbell", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "machine", label: "Machines" },
  { value: "bands", label: "Resistance Bands" },
  { value: "kettlebell", label: "Kettlebell" },
];

const HOME_EQUIPMENT: Equipment[] = ["bodyweight", "dumbbell", "bands"];
const GYM_EQUIPMENT: Equipment[] = ["bodyweight", "dumbbell", "barbell", "machine", "bands", "kettlebell"];

const FOCUS_OPTIONS: { value: Focus; label: string }[] = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_body", label: "Upper Body" },
  { value: "lower_body", label: "Lower Body" },
  { value: "push", label: "Push" },
  { value: "pull", label: "Pull" },
  { value: "legs", label: "Legs" },
  { value: "core", label: "Core" },
  { value: "cardio", label: "Cardio" },
];

export function WorkoutGeneratorForm() {
  const [goal, setGoal] = useState<Goal>("fat_loss");
  const [experience, setExperience] = useState<Difficulty>("beginner");
  const [equipment, setEquipment] = useState<Equipment[]>(["bodyweight"]);
  const [focus, setFocus] = useState<Focus>("full_body");
  const [focusMode, setFocusMode] = useState<"preset" | "custom">("preset");
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customExercises, setCustomExercises] = useState<
    Awaited<ReturnType<typeof getCustomExercises>>
  >([]);

  useEffect(() => {
    getCustomExercises().then(setCustomExercises);
  }, []);

  function handleGenerate() {
    if (equipment.length === 0) {
      setError("Select at least one equipment option.");
      return;
    }
    if (focusMode === "custom" && muscleGroups.length === 0) {
      setError("Select at least one muscle to target.");
      return;
    }
    setError(null);
    setSaved(false);
    setPlan(
      generateWorkout(
        {
          goal,
          experience,
          equipment,
          focus,
          muscleGroups: focusMode === "custom" ? muscleGroups : undefined,
        },
        customExercises
      )
    );
  }

  async function handleSave() {
    if (!plan) return;
    await saveWorkout(plan);
    setSaved(true);
    // notify saved-workouts list (same tab) to refresh
    window.dispatchEvent(new CustomEvent("fitwid:workouts-updated"));
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-6">
          <ToggleGroup
            label="Goal"
            value={goal}
            onChange={setGoal}
            options={[
              { value: "fat_loss", label: "Fat Loss" },
              { value: "muscle_gain", label: "Muscle Gain" },
              { value: "strength", label: "Strength" },
              { value: "athletic_performance", label: "Athletic Performance" },
              { value: "endurance", label: "Endurance" },
            ]}
          />

          <ToggleGroup
            label="Experience"
            value={experience}
            onChange={setExperience}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-sm font-medium text-foreground">
              Where are you training?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEquipment(HOME_EQUIPMENT)}
                className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-crimson/50 transition"
              >
                🏠 Home
              </button>
              <button
                type="button"
                onClick={() => setEquipment(GYM_EQUIPMENT)}
                className="rounded-md border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:border-crimson/50 transition"
              >
                🏋️ Full Gym
              </button>
            </div>
            <p className="text-[11px] text-muted">
              Quick presets — fine-tune the exact equipment below.
            </p>
          </div>

          <MultiToggleGroup
            label="Available Equipment"
            values={equipment}
            onChange={setEquipment}
            options={EQUIPMENT_OPTIONS}
          />

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-sm font-medium text-foreground">Focus</span>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setFocusMode("preset")}
                className={
                  focusMode === "preset"
                    ? "rounded-md border border-crimson bg-crimson/15 text-crimson px-3 py-2 text-sm font-medium"
                    : "rounded-md border border-border px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
                }
              >
                Preset Category
              </button>
              <button
                type="button"
                onClick={() => setFocusMode("custom")}
                className={
                  focusMode === "custom"
                    ? "rounded-md border border-crimson bg-crimson/15 text-crimson px-3 py-2 text-sm font-medium"
                    : "rounded-md border border-border px-3 py-2 text-sm font-medium text-muted hover:text-foreground"
                }
              >
                Pick Muscles
              </button>
            </div>

            {focusMode === "preset" ? (
              <Select value={focus} onChange={(e) => setFocus(e.target.value as Focus)}>
                {FOCUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : (
              <>
                <p className="text-[11px] text-muted mb-1">
                  Select any combination — ordered small to big.
                </p>
                <MultiToggleGroup
                  label="Target Muscles"
                  values={muscleGroups}
                  onChange={setMuscleGroups}
                  options={MUSCLE_GROUPS_SMALL_TO_BIG.map((m) => ({
                    value: m,
                    label: MUSCLE_GROUP_LABELS[m],
                  }))}
                />
              </>
            )}
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button size="lg" className="w-full" onClick={handleGenerate}>
            Generate Workout
          </Button>
        </div>
      </Card>

      {plan && (
        <WorkoutPlanDisplay
          plan={plan}
          onSave={handleSave}
          onRegenerate={handleGenerate}
          saved={saved}
        />
      )}
    </div>
  );
}
