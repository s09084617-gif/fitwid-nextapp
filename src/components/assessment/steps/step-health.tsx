"use client";

import { MultiToggleGroup } from "@/components/ui/multi-toggle-group";
import type { Equipment } from "@/lib/workout-data";

const MEDICAL_OPTIONS = [
  "None",
  "Diabetes",
  "High Blood Pressure",
  "Heart Condition",
  "Joint/Back Issues",
  "Pregnant",
  "Other",
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: "bodyweight", label: "Bodyweight" },
  { value: "dumbbell", label: "Dumbbells" },
  { value: "barbell", label: "Barbell" },
  { value: "machine", label: "Machines" },
  { value: "bands", label: "Bands" },
  { value: "kettlebell", label: "Kettlebell" },
];

export interface HealthData {
  injuries: string;
  medicalConditions: string[];
  equipment: Equipment[];
}

interface StepHealthProps {
  data: HealthData;
  onChange: <K extends keyof HealthData>(key: K, value: HealthData[K]) => void;
}

export function StepHealth({ data, onChange }: StepHealthProps) {
  function toggleMedical(condition: string) {
    if (condition === "None") {
      onChange("medicalConditions", ["None"]);
      return;
    }
    const withoutNone = data.medicalConditions.filter((c) => c !== "None");
    const has = withoutNone.includes(condition);
    onChange(
      "medicalConditions",
      has ? withoutNone.filter((c) => c !== condition) : [...withoutNone, condition]
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl mb-1.5">Health & equipment</h2>
        <p className="text-sm text-muted">
          This isn&apos;t a medical diagnosis — we flag anything you note here
          for your coach rather than modifying your plan ourselves.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Injuries (optional)
        </label>
        <textarea
          value={data.injuries}
          onChange={(e) => onChange("injuries", e.target.value)}
          rows={2}
          placeholder="e.g. Lower back tweak in 2023, be careful with deadlifts"
          className="w-full rounded-md border border-border bg-surface px-4 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
        />
      </div>

      <MultiToggleGroup
        label="Medical Conditions (select any that apply)"
        values={data.medicalConditions}
        onChange={(v) => {
          const added = v.find((x) => !data.medicalConditions.includes(x));
          if (added) toggleMedical(added);
          else {
            const removed = data.medicalConditions.find((x) => !v.includes(x));
            if (removed) toggleMedical(removed);
          }
        }}
        options={MEDICAL_OPTIONS.map((m) => ({ value: m, label: m }))}
      />

      <MultiToggleGroup
        label="Equipment Available"
        values={data.equipment}
        onChange={(v) => onChange("equipment", v)}
        options={EQUIPMENT_OPTIONS}
      />
    </div>
  );
}
