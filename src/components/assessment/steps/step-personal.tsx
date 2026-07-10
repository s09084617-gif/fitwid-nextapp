"use client";

import { Input } from "@/components/ui/input";
import { ToggleGroup } from "@/components/ui/toggle-group";
import type { Gender } from "@/lib/assessment";

export interface PersonalData {
  name: string;
  age: string;
  gender: Gender;
  heightCm: string;
  weightKg: string;
}

interface StepPersonalProps {
  data: PersonalData;
  onChange: <K extends keyof PersonalData>(key: K, value: PersonalData[K]) => void;
}

export function StepPersonal({ data, onChange }: StepPersonalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl mb-1.5">Let&apos;s start with you</h2>
        <p className="text-sm text-muted">
          The basics — everything after this is built around these numbers.
        </p>
      </div>

      <Input
        label="Name"
        placeholder="e.g. Rahul Mehta"
        value={data.name}
        onChange={(e) => onChange("name", e.target.value)}
      />

      <ToggleGroup
        label="Gender"
        value={data.gender}
        onChange={(v) => onChange("gender", v as Gender)}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Age"
          type="number"
          placeholder="28"
          value={data.age}
          onChange={(e) => onChange("age", e.target.value)}
        />
        <Input
          label="Height (cm)"
          type="number"
          placeholder="175"
          value={data.heightCm}
          onChange={(e) => onChange("heightCm", e.target.value)}
        />
        <Input
          label="Weight (kg)"
          type="number"
          placeholder="78"
          value={data.weightKg}
          onChange={(e) => onChange("weightKg", e.target.value)}
        />
      </div>
    </div>
  );
}
