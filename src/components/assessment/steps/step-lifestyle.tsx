"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToggleGroup } from "@/components/ui/toggle-group";
import type { ActivityLevel } from "@/lib/assessment";
import type { Difficulty } from "@/lib/workout-data";
import type { DietTag } from "@/lib/indian-foods";

export interface LifestyleData {
  activityLevel: ActivityLevel;
  experience: Difficulty;
  workoutDaysPerWeek: string;
  sleepHours: string;
  waterIntakeLiters: string;
  dietTag: DietTag;
}

interface StepLifestyleProps {
  data: LifestyleData;
  onChange: <K extends keyof LifestyleData>(key: K, value: LifestyleData[K]) => void;
}

export function StepLifestyle({ data, onChange }: StepLifestyleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl mb-1.5">Your lifestyle</h2>
        <p className="text-sm text-muted">
          How you live day to day matters as much as what happens in the gym.
        </p>
      </div>

      <Select
        label="Activity Level"
        value={data.activityLevel}
        onChange={(e) => onChange("activityLevel", e.target.value as ActivityLevel)}
      >
        <option value="sedentary">Sedentary (little to no exercise)</option>
        <option value="light">Light (1–3 days/week)</option>
        <option value="moderate">Moderate (3–5 days/week)</option>
        <option value="active">Active (6–7 days/week)</option>
        <option value="very_active">Very Active (physical job + training)</option>
      </Select>

      <ToggleGroup
        label="Workout Experience"
        value={data.experience}
        onChange={(v) => onChange("experience", v as Difficulty)}
        options={[
          { value: "beginner", label: "Beginner" },
          { value: "intermediate", label: "Intermediate" },
          { value: "advanced", label: "Advanced" },
        ]}
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Workout Days/Week"
          type="number"
          placeholder="4"
          min={1}
          max={7}
          value={data.workoutDaysPerWeek}
          onChange={(e) => onChange("workoutDaysPerWeek", e.target.value)}
        />
        <Input
          label="Sleep (hrs/night)"
          type="number"
          placeholder="7"
          value={data.sleepHours}
          onChange={(e) => onChange("sleepHours", e.target.value)}
        />
        <Input
          label="Water (L/day)"
          type="number"
          placeholder="3"
          value={data.waterIntakeLiters}
          onChange={(e) => onChange("waterIntakeLiters", e.target.value)}
        />
      </div>

      <ToggleGroup
        label="Food Preference"
        value={data.dietTag}
        onChange={(v) => onChange("dietTag", v as DietTag)}
        options={[
          { value: "veg", label: "Vegetarian" },
          { value: "egg", label: "Eggetarian" },
          { value: "nonveg", label: "Non-Veg" },
          { value: "vegan", label: "Vegan" },
        ]}
      />
    </div>
  );
}
