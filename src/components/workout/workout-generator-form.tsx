"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { MultiToggleGroup } from "@/components/ui/multi-toggle-group";
import { WorkoutPlanDisplay } from "@/components/workout/workout-plan-display";
import { saveWorkout, getCustomExercises } from "@/lib/local-store";
import {
  generateWorkout,
  type Goal,
  type Focus,
  type WorkoutPlan,
} from "@/lib/workout-generator";
import type { Difficulty, Equipment } from "@/lib/workout-data";

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: "bodyweight", label: "Bodyweight" },
  { value: "dumbbell", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "machine", label: "Machines" },
  { value: "bands", label: "Resistance Bands" },
  { value: "kettlebell", label: "Kettlebell" },
];

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
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    if (equipment.length === 0) {
      setError("Select at least one equipment option.");
      return;
    }
    setError(null);
    setSaved(false);
    setPlan(generateWorkout({ goal, experience, equipment, focus }, getCustomExercises()));
  }

  function handleSave() {
    if (!plan) return;
    saveWorkout(plan);
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

          <MultiToggleGroup
            label="Available Equipment"
            values={equipment}
            onChange={setEquipment}
            options={EQUIPMENT_OPTIONS}
          />

          <Select
            label="Focus"
            value={focus}
            onChange={(e) => setFocus(e.target.value as Focus)}
          >
            {FOCUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

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
