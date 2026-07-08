"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AssessmentResults } from "@/components/assessment/results";
import {
  runAssessment,
  type AssessmentInput,
  type AssessmentResult,
  type Gender,
  type Goal,
  type ActivityLevel,
} from "@/lib/assessment";
import { saveLastAssessment } from "@/lib/db/user-data";

const defaultForm = {
  gender: "male" as Gender,
  age: "",
  heightCm: "",
  weightKg: "",
  activityLevel: "moderate" as ActivityLevel,
  goal: "fat_loss" as Goal,
  waistCm: "",
  neckCm: "",
  hipCm: "",
};

export function AssessmentForm() {
  const [form, setForm] = useState(defaultForm);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof defaultForm>(
    key: K,
    value: (typeof defaultForm)[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
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
    };

    const calculated = runAssessment(input);
    saveLastAssessment(calculated, weightKg);
    setResult(calculated);
  }

  if (result) {
    return (
      <AssessmentResults
        result={result}
        onRetake={() => {
          setResult(null);
        }}
      />
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Input
            label="Age"
            type="number"
            placeholder="28"
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
          />
          <Input
            label="Height (cm)"
            type="number"
            placeholder="175"
            value={form.heightCm}
            onChange={(e) => update("heightCm", e.target.value)}
          />
          <Input
            label="Weight (kg)"
            type="number"
            placeholder="78"
            value={form.weightKg}
            onChange={(e) => update("weightKg", e.target.value)}
          />
        </div>

        <Select
          label="Activity Level"
          value={form.activityLevel}
          onChange={(e) =>
            update("activityLevel", e.target.value as ActivityLevel)
          }
        >
          <option value="sedentary">Sedentary (little to no exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="very_active">
            Very Active (physical job + training)
          </option>
        </Select>

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

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-sm text-crimson font-medium"
          >
            {showAdvanced ? "− Hide" : "+ Add"} measurements for a more
            accurate body fat estimate
          </button>
          {showAdvanced && (
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <Input
                label="Waist (cm)"
                type="number"
                placeholder="86"
                value={form.waistCm}
                onChange={(e) => update("waistCm", e.target.value)}
              />
              <Input
                label="Neck (cm)"
                type="number"
                placeholder="38"
                value={form.neckCm}
                onChange={(e) => update("neckCm", e.target.value)}
              />
              {form.gender === "female" && (
                <Input
                  label="Hip (cm)"
                  type="number"
                  placeholder="96"
                  value={form.hipCm}
                  onChange={(e) => update("hipCm", e.target.value)}
                />
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full">
          Calculate My Results
        </Button>
      </form>
    </Card>
  );
}
